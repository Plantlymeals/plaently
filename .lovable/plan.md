# MIGRATION_SPEC.md + redirects_source.csv

Två nya filer i projektroten. Ingen befintlig fil ändras, ingen ny kod skrivs, all läsning mot backend och Shopify är skrivskyddad. Dokumentet skrivs på svenska med markdown-tabeller och ska räcka för att bygga om PLÄNTLY i en annan stack utan tillgång till originalkoden.

Underlaget är redan inläst och verifierat i projektet (48 route-filer, 369 i18n-nycklar, 4 produkter och 8 paket i CMS, 57 URL:er i sitemap).

## 1. Designtokens
Från `src/styles.css` och Tailwind-klassmönstren i komponenterna.
- Färgtabell: token → HSL → hex → användning. Verifierade värden, t.ex. primary `hsl(100 48% 45%)` = `#5FA92C`, foreground `hsl(0 0% 8%)` = `#141414`, border `hsl(100 15% 88%)`, muted-foreground `hsl(0 0% 40%)`, secondary/accent `hsl(100 45% 84%)`, plus hela sidebar-uppsättningen.
- Gradienter: `--gradient-hero/primary/subtle` (alla `linear-gradient(180deg, hsl(100 48% 45%) → hsl(90 48% 84%))`). Skuggor: `--shadow-soft/card/elevated`.
- Typografi: Poppins med metrics-matchad fallback (`size-adjust 112.16%`, ascent 93.10%, descent 30.85%, line-gap 8.78%). Tabell per element (h1–h6, brödtext, knapp, caption) med font-size per breakpoint, weight, line-height, letter-spacing.
- Spacing-skala (Tailwind 4), radius (`--radius: 0.75rem` + sm/md/lg/xl/2xl/3xl/4xl), container (max 1400px, 2rem padding, centrerad).
- Breakpoints sm/md/lg/xl/2xl och animationer: `fadeUp` (+ delay 1–3), `scaleIn`, `accordion-down/up`, `float`.

## 2. Sidinventering
Alla routes i `src/routes/` med URL, syfte, publik/admin och sektionsordning uppifrån och ner. Egna tabeller för publika sidor, sv/en-kategoripar, blogg, produkt- och redirect-routes.

Språkstruktur redovisas som den faktiskt är: **inget locale-prefix och ingen separat domän**. Språk kodas i åtta hårdkodade URL-par i `src/lib/localeAlternates.ts` (t.ex. `/proteinrika-maltider` ⇄ `/high-protein-meals`, `/frakt` ⇄ `/shipping`). Övriga URL:er är enspråkiga adresser som byter språk via en Zustand-store i localStorage (`plantely-lang`, default `sv`) och deklarerar sig själva för både sv och en.

Egen tabell "Ska inte migreras" för de 12 admin-routerna (`/admin`, `/admin/login`, `/admin/blog` m.fl.) plus `/mcp` och `/unsubscribe`, med indexerbarhet idag (samtliga blockerade i `robots.txt`, admin dessutom bakom auth-gate).

## 3. Sektionsanatomi
Header, Hero, StarterPackHighlight, TrustSection, ProblemSolution, BundleSection, ProductOverview, NutritionPreview, WhySection, HowItWorks, InternalLinks, LifestyleSection, MealFinderQuiz, Testimonials, FAQ, FinalCTA, StickyMobileCta, CartDrawer, Footer. Per sektion: layoutgrid, elementlista, CMS-redigerbara fält med backend-tabell (`hero_content`, `products`, `bundles`, `testimonials`, `faqs`, `blog_posts`, `product_reviews`) och mobilbeteende.

## 4. All text
Alla 369 nycklar ur `src/lib/i18n.ts` som `nyckel | svenska | engelska`, grupperade per sida och sektion med nyckelnamnen oförändrade (inklusive de flerradiga shipping-/cart-strängarna med `{amount}`-platshållare). Plus all hårdkodad kategoritext ur `src/data/categoryContent.ts` i sv+en: metaTitle, metaDescription, H1, intro, quickAnswer, benefits, jämförelsetabell, sektioner, FAQ, CTA, keywordLabel, related.

## 5. Produktdata
Fyra måltider och åtta paket med namn, handle/slug, pris, beskrivning, näringsvärden, ingredienser, allergener och bildreferens. Varje fält märks med källa:
- **Shopify** — live-pris, lagerstatus, varianter, `shopify_product_id`
- **CMS** (`products`, `bundles`) — namn, beskrivning, nutrition-JSON, ingredienser, allergener, sort_order
- **Endast lokal kod** — märks tydligt som förlustrisk: SEO-titlar/beskrivningar och schema-SKU per handle i `src/lib/productSeo.ts`, handle-alias och `plant-based-`-regler, `SINGLE_MEAL_PRICE = 39` och paketrabattlogiken i `src/lib/bundleSavings.ts`, smak- och bildmappning samt vegan-flaggor i `src/lib/productImages.ts`, marknadspriser för frakt i `src/lib/markets.ts`.
- Noterar även konflikten mellan CMS-nutrition (t.ex. 350–390 kcal) och per-portion-värdena i koden (228–285 kcal), så den reds ut vid migrering.

## 6. SEO-inventering
Per route: title, meta description, canonical, OG- och Twitter-taggar, hreflang-set, robots och JSON-LD (Organization/WebSite på start, FAQPage på kategorier och `/faq`, Product med offer/aggregateRating, BlogPosting, ItemList på `/products`, BreadcrumbList). Skiljer på routes med SSR-`head()` och routes som fortfarande får metadata klientsidigt via `SEOHead`/Helmet (`/about`, `/contact`, `/nutrition`, `/lifestyle`, integritetspolicy).

`public/sitemap.xml` och `public/robots.txt` klistras in ordagrant och i sin helhet i kodblock. Omdirigeringar återges ordagrant: 301 från legacy-handles i `src/lib/productSeo.ts` (`monthly-box-30-cups` → `24-cups`, `office-pack-60-cups` → `48-cups`, `big-office-pack-120-cups` → `96-cups`, samt prefix-alias till `plant-based-*`), 301 från `/products/:slug` → `/product/:handle`, och `www` → apex på hostingnivå. Cache-headers från `public/_headers` och `src/server.ts` dokumenteras också.

## 7. Bilder och assets
Tabell över varje fil i `public/images/**` (hero, logo, 8 produkt-/paketbilder, 3 bundle-varianter i 640/960/1073) och `src/assets/**` (4 cup-bilder, hero webp/jpg, logo): filväg, användningsplats, renderade dimensioner och aspect ratio, laddningsstrategi (preload/lazy/srcset). Shopify-CDN-bilder som hämtas dynamiskt listas separat, liksom den R2-hostade OG-fallbackbilden.

## 8. redirects_source.csv
En rad per publik route, kolumner: `path,locale,sidtyp,h1,title,canonical,indexerbar`. Sluggar utan domän, locale `sv`/`en`, sidtyp start/kategori/produkt/bundle/blogg/statisk, indexerbar ja/nej (t.ex. `nej` för `/kopsvillkor` och `/terms-of-service` som är noindex). Admin-routes utesluts helt. Textfält med kommatecken citeras.

## Teknisk not
Uppskattad omfattning 1500–2500 rader markdown. i18n- och kategoritabellerna genereras deterministiskt ur källfilerna via ett tillfälligt skript utanför projektet, så inga nycklar tappas. Shopify Admin-API-åtkomsten är för närvarande inte autentiserad — Shopify-specifika fält (live-pris, varianter, lagerstatus) hämtas i så fall via Storefront-katalogen i koden och CMS-speglingen, och allt som inte kan verifieras märks uttryckligen som "ej verifierat mot Shopify".
