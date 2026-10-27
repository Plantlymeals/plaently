# Polsk pilot på /pl/ (samma mönster som tyska)

Nio produktsidor (Starter Pack, fyra smaker, fyra boxar), /pl/products och fyra kategorisidor. De fyra smakerna startar som ej godkända: de visar svensk originaltext, är `noindex, follow` och ligger utanför sajtkartan tills du (eller någon som kan polska) godkänt texten.

## 1. Språktypen först
`ProductPageLocale` i `src/lib/i18n.ts` utökas till `"sv" | "en" | "de" | "pl"`. Typkontrollen används sedan för att hitta varje ställe som grenar på språk. Varje ställe får en egen, uttrycklig `pl`-gren, aldrig en återanvänd `de`- eller `en`-gren. Polsk ordbok `productPagePl` med samma nycklar som `productPageDe`, svensk reserv per nyckel.

## 2. Ny datafil `src/data/productCopyPl.ts`
- `PL_PILOT_HANDLES` (nio handtag), `isPolishPilotHandle()`.
- `PL_PRODUCT_COPY` för de fyra smakerna, översatt från den granskade tyska texten. Alla siffror (procent, kcal/kJ, E-nummer) kopieras exakt. `approved: false`.
- `getApprovedPlCopy()`, `hasApprovedPlCopy()`, `isPolishPageReady()`. Den sista läser bara den polska `approved`-flaggan (kontrolleras mot hur `isGermanPageReady` ser ut idag innan den skrivs).

## 3. Nya sidor
`pl.product.$handle.tsx`, `pl.products.tsx`, `pl.healthy-fast-food.tsx`, `pl.high-protein-meals.tsx`, `pl.plant-based-meals.tsx`, `pl.protein-cups.tsx`. Kopior av de tyska, med `pageLocale: "pl"`, polsk "hittades inte"-text. Handtag utanför piloten 301 till svenska sidan.

## 4. Delade filer som får en `pl`-gren
- `Products.tsx`: polsk text hämtas via `getApprovedPlCopy()` (importeras uttryckligen), annars svenskt original; brödsmulor och produktlistlänk `/pl/products`.
- `productDescription.ts` (`translateProductHtml`): uttrycklig `pl`-gren med kommentar: polska maskinöversätts aldrig, svenska originalet visas.
- `productSeo.ts`: polsk titel/beskrivning per produkt, `pl_PL` som og:locale, `/pl/`-adresser, hreflang med `pl` bara när sidan är redo (självreferens från start).
- `productSchema.ts`, `SEOHead.tsx`, `categoryHead.ts`, `categoryContent.ts` (polsk kategoritext), `CategoryPage.tsx`, `Header.tsx`, `Footer.tsx`, `__root.tsx` (`<html lang="pl">`).

## 5. Sajtkarta
`scripts/generate-sitemap.ts` får polska poster med samma regel: bara sidor där `isPolishPageReady()` är sant. Just nu blir det Starter Pack, boxsidorna, /pl/products och kategorisidorna, om de följer det tyska upplägget.

## Rörs inte
Svenska, engelska och tyska texter, den globala sv/en-växlaren, marknader/frakt/valuta, Shopify, sändning till Search Console.

## Innan publicering visar jag
- Lista över ändrade och nya filer med en rad motivering per fil.
- Citat av koden i `isPolishPageReady()` och den polska grenen i `translateProductHtml`.
- Resultat från typkontroll, bygge och `bun run check:seo`.
- Kontroll av serverrenderad HTML för en smak på /pl/: `noindex, follow`, svensk brödtext, ingen hreflang till /pl/ från andra språk.

## Att observera
Den polska kategori-, SEO- och produkttexten skrivs av mig utifrån tyskan. Någon som kan polska behöver läsa den innan `approved: true` sätts.
