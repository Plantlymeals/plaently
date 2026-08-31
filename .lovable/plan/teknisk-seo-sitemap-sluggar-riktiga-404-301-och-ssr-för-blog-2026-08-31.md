# Teknisk SEO: sitemap-sluggar, riktiga 404/301 och SSR för bloggen

Jag har kontrollerat alla tre buggarna mot koden. Alla tre stämmer, och ingen av dem täcks av de två tidigare planerna:

- `seo-fixar-strukturerad-data-i-ssr-rubriker-alt-text-2026-08-29` handlar om Product- och FAQPage-schema, rubriker och alt-text. Inget om sitemap-sluggar, 404, 301 eller bloggen.
- `server-rendera-produktlistan-på-products-2026-08-30` säger uttryckligen att den bara rör listan `/products` och inte produktdetaljsidorna. Inget om bloggen.

Den enda överlappningen är arbetssättet: bloggfixen använder exakt samma mönster (loader + `head()`) som redan byggdes för `/products`.

## Vad jag bekräftade i koden

1. `scripts/generate-sitemap.ts` rad 108 kör `e.node.handle.replace(/^plant-based-/, "")`. Det är därför sitemapen listar `/product/fusilli-bolognese` i stället för de riktiga `/product/plant-based-fusilli-bolognese`. Prefixet ska bevaras — `canonicalizeHandle()` i `src/lib/productSeo.ts` bevarar det medvetet (kommentar i filen).
2. `src/routes/product.$handle.tsx` har en loader som anropar `loadProductSchemaData()`, men den returnerar tomt objekt vid miss i stället för att kasta `notFound()`. Sidan renderas därför med 200 och fallback-titel för vilken slug som helst.
3. `src/routes/products_.$slug.tsx` renderar `<Navigate>` — en klientsidig redirect, exakt som du mätte. Ingen HTTP-status, ingen Location.
4. `src/routes/blog.tsx` och `src/routes/blog_.$slug.tsx` innehåller bara `component:` — ingen loader, ingen `head()`. All data hämtas i `useEffect` i `src/pages/Blog.tsx` respektive `src/pages/BlogPost.tsx`. Därför tom rå HTML.

## 1) Sitemap-sluggar + riktig 404 på okänd produkt

**`scripts/generate-sitemap.ts`**
- Ta bort prefix-strippningen; använd Shopify-handlen som den är och kör den genom samma aliasmappning som körs live.
- Behåll dedupliceringen så att en aliasad handle inte listas två gånger.
- Resultat: sitemapen listar `/product/plant-based-fusilli-bolognese`, `/product/plant-based-pasta-carbonara`, `/product/plant-based-smoky-bbq-lentils`, `/product/plant-based-yellow-curry-rice` och inte de korta varianterna.

**`supabase/functions/sitemap/index.ts`** har samma logik för den dynamiska sitemapen och behöver samma rättning så att de två inte pekar olika.

**`src/routes/product.$handle.tsx`**
- Loadern får skilja på "produkt saknas" och "uppslag misslyckades". Vid bekräftad miss (Shopify svarar utan produkt) kastas `notFound()`, vilket ger HTTP 404.
- Vid nätverksfel/timeout mot Shopify kastas *inte* 404 — då renderas sidan som idag, så ett tillfälligt fel inte avindexerar riktiga produkter.
- Rutten får en `notFoundComponent` med svensk 404-text och länk till `/products`, samt `robots: noindex` via `head()` när loader-datan saknas.
- Det kräver att `src/lib/seoLoaders.ts` skiljer på de två fallen — idag returnerar den samma tomma objekt för båda. Den får returnera en flagga (t.ex. `found: false` vid bekräftad miss, `found: null` vid fel/timeout).

## 2) Riktiga 301-redirects på servern

**`src/routes/products_.$slug.tsx`**
- Byt `<Navigate>` mot `beforeLoad` som kastar `redirect({ to: "/product/$handle", params, statusCode: 301 })`. Då kommer Location-headern i första svaret.

**`src/lib/productSeo.ts` / `src/routes/product.$handle.tsx`**
- Lägg till de fyra korta sluggarna i aliasmappen: `fusilli-bolognese` → `plant-based-fusilli-bolognese`, `pasta-carbonara` → `plant-based-pasta-carbonara`, `smoky-bbq-lentils` → `plant-based-smoky-bbq-lentils`, `yellow-curry-rice` → `plant-based-yellow-curry-rice`.
- Viktigt: nyckelfunktionen `seoKey()` strippar prefixet för att slå upp SEO-texten, så aliasmappen får inte råka skapa en cykel. Aliasen läggs där `canonicalizeHandle()` läser dem, inte där `seoKey()` läser dem.
- Den befintliga `beforeLoad` i `product.$handle.tsx` gör redan 301 när canonical skiljer sig — därmed börjar de korta sluggarna svara 301 automatiskt.

**`src/components/LegacyQueryRedirect.tsx`** behålls oförändrad som klientsidigt skyddsnät.

## 3) SSR för bloggen

Samma mönster som `/products`.

**Ny fil `src/lib/blog.server.ts`** — rena Supabase REST-anrop (samma stil som `restSelect` i `src/lib/seoLoaders.ts`): hämta publicerade inlägg för ett språk, respektive ett enskilt inlägg på slug.

**Ny fil `src/lib/blog.functions.ts`** — tunna `createServerFn`-wrappers: `getBlogPosts` och `getBlogPost`.

**`src/routes/blog.tsx`**
- `loader` hämtar publicerade svenska inlägg.
- `head()` sätter titel, description, canonical `https://plaently.com/blog`, og-taggar och behåller BreadcrumbList-schemat.

**`src/routes/blog_.$slug.tsx`**
- `loader` hämtar inlägget på slug; saknas det kastas `notFound()` (404, inte 200).
- `head()` bygger titel, meta description från `excerpt`, canonical `https://plaently.com/blog/{slug}`, `og:type: article`, og:image från inläggets bild om den finns, samt BlogPosting-schema (`headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`, `image`, `mainEntityOfPage`).

**`src/pages/Blog.tsx` och `src/pages/BlogPost.tsx`**
- Läs initialdata från `Route.useLoaderData()` i stället för tomt `useState`, så listan och artikeltexten finns i första HTML-svaret. Klientlogiken (kategorifilter, språkbyte, relaterade inlägg) behålls som den är.
- `SEOHead` i dessa två sidor sätts till att inte äga metadata längre (samma `routeOwnsMetadata`/`routeOwnsLinks`-mekanism som redan används på produktsidorna), så inga dubbla title/canonical.
- Blogglistan hämtar fortfarande om vid språkbyte på klienten; SSR-varianten är svenska.

Ingen designändring: layout, klasser och texter är oförändrade.

## Godkännandekriterier (rå fetch mot produktion efter publicering)

1. `curl -s https://plaently.com/sitemap.xml | grep product/` innehåller de fyra `plant-based-*`-adresserna och inga korta varianter.
2. `curl -o /dev/null -w '%{http_code}' https://plaently.com/product/this-slug-definitely-does-not-exist-xyz123` ger `404`.
3. `curl -o /dev/null -w '%{http_code}' https://plaently.com/product/plant-based-fusilli-bolognese` ger `200`.
4. `curl -sI https://plaently.com/products/plant-based-fusilli-bolognese` ger `301` med `Location: /product/plant-based-fusilli-bolognese`.
5. `curl -sI https://plaently.com/product/fusilli-bolognese` ger `301` till `/product/plant-based-fusilli-bolognese`.
6. `curl -s https://plaently.com/blog` innehåller minst en riktig inläggstitel och inte "Inga inlägg ännu".
7. `curl -s https://plaently.com/blog/om-plantly` innehåller `<title>`, `<meta name="description">`, `<link rel="canonical" href="https://plaently.com/blog/om-plantly">` och ett `"@type":"BlogPosting"`-block — allt i rå HTML.
8. `curl -o /dev/null -w '%{http_code}' https://plaently.com/blog/finns-inte-xyz123` ger `404`.
9. Rich Results Test validerar en bloggartikel utan fel.

Verifieringen körs med rå `curl` mot produktion, inte i preview-DOM.
