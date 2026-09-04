# MIGRATION_SPEC.md — komplett projektspecifikation

Skapa en enda ny fil i projektroten: `MIGRATION_SPEC.md`. Ingen befintlig fil ändras, ingen ny kod skrivs. Dokumentet ska vara tillräckligt uttömmande för att bygga om PLÄNTLY i en annan teknikstack utan tillgång till originalkoden.

## Innehåll och källor

**1. Designtokens**
Hämtas ur `src/styles.css` (`:root`-variabler, `@theme inline`, keyframes, container-utility) samt Tailwind-klassmönster i komponenterna.
- Färgtabell: token → HSL → hex → användning (bakgrund, primär CTA, border, muted text, sidebar m.m.)
- Gradienter (`--gradient-hero/primary/subtle`) och skuggor (`--shadow-soft/card/elevated`)
- Typografi: Poppins-stack + fallback-metrics, tabell per element (h1–h6, brödtext, knapp, caption) med font-size per breakpoint, weight, line-height, letter-spacing
- Spacing-skala (Tailwind 4-baserad), border-radius (`--radius` 0.75rem + härledda), container (max 1400px, 2rem padding)
- Breakpoints (sm/md/lg/xl/2xl) och animationer (fadeUp, scaleIn, accordion)

**2. Sidinventering**
Alla 48 filer i `src/routes/` mappade till URL, syfte, publik/admin, och sektionsordning uppifrån och ner (från respektive `src/pages/*`-komponent). Separata tabeller för publika sidor, kategorisidor (sv/en-par), blogg, produktsidor och admin.

**3. Sektionsanatomi**
Per återkommande sektion — Header, Hero, ProblemSolution, WhySection, HowItWorks, ProductOverview, BundleSection, StarterPackHighlight, NutritionPreview, LifestyleSection, TrustSection, MealFinderQuiz, Testimonials, FAQ, FinalCTA, StickyMobileCta, CartDrawer, Footer: layoutgrid, elementlista, CMS-redigerbara fält (via admin-sidorna/Supabase-tabeller), och mobilbeteende.

**4. All text**
Varje nyckel ur `src/lib/i18n.ts` i tabell `nyckel | svenska | engelska`, grupperat per sida/sektion. Kompletteras med hårdkodad sidtext i `src/data/categoryContent.ts` (sv+en per kategorisida: H1, intro, quick answer, benefits, jämförelsetabell, sektioner, FAQ, CTA).

**5. Produktdata**
Fyra måltider och alla bundles: namn, handle/slug, pris (SEK/EUR/GBP där relevant), beskrivning, näringsvärden, ingredienser, bildreferens. Källor: Shopify-katalog via `src/lib/products.*`, `src/lib/productSeo.ts`, `src/lib/bundleSavings.ts`, `src/lib/productImages.ts` samt CMS-tabeller i backend (läses skrivskyddat).

**6. SEO-inventering**
Per route: title, meta description, canonical, OG/Twitter-taggar, hreflang-set, robots och JSON-LD. Källor: varje routes `head()`, `src/lib/categoryHead.ts`, `src/lib/staticPageHead.ts`, `src/lib/seoLoaders.ts`, `src/lib/localeAlternates.ts`, `src/components/SEOHead.tsx`, `public/sitemap.xml`, `public/robots.txt`.

**7. Bilder och assets**
Tabell över varje fil i `public/images/**` och `src/assets/**`: filväg, användningsplats, renderade dimensioner/aspect ratio, laddningsstrategi (preload/lazy/srcset), plus Shopify-CDN-bilder som hämtas dynamiskt.

## Teknisk not
Dokumentet blir omfattande (uppskattat 1500–2500 rader). Det skrivs på svenska med markdown-tabeller. Läsning av produktdata sker via read-only-frågor mot backend och Shopify-katalogen; inga skrivningar görs.
