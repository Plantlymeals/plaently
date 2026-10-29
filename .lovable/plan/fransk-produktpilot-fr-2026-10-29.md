# Fransk produktpilot (/fr/)

Samma mönster som den polska piloten: nio produktsidor + /fr/products, briefens franska text ordagrant (approved: true). Inga franska kategorisidor denna omgång.

## Vad som byggs

1. **Språktyp + UI-texter** — `ProductPageLocale` utökas med `"fr"`; ny ordbok `productPageFr` (47 nycklar ur briefen) och en uttrycklig `fr`-gren i `tLocale()` i samma steg, så franska knappar/formulär inte tyst faller tillbaka till svenska.
2. **Produkttext** — ny `src/data/productCopyFr.ts` (FR_PILOT_HANDLES, isFrenchPilotHandle, FR_PRODUCT_COPY för de fyra smakerna, getApprovedFrCopy, hasApprovedFrCopy, isFrenchPageReady). Jämförs först mot nuvarande `isPolishPageReady()`/`isGermanPageReady()`; eventuell skillnad flaggas.
3. **Sidor** — `fr.product.$handle.tsx` och `fr.products.tsx` (kopior av pl-versionerna), "Produit introuvable" enligt briefen. Icke-pilothandtag 301:as till svenska sidan, som för polska.
4. **Delade filer med egen fr-gren** — Products.tsx (textkälla, brödsmula, produktlistsökväg, Starter Pack-länk), Header.tsx (routeLocale, "Produits"), Breadcrumbs.tsx ("Accueil"), Footer.tsx (fr-produktlänkar, svenska kategorilänkar), __root.tsx (`lang="fr"`), SEOHead.tsx, productSchema.ts (fr-FR), productDescription.ts (egen fr-gren, aldrig maskinöversättning), category-filerna utesluter fr på samma sätt som pl.
5. **SEO** — `fr`-titlar/beskrivningar för alla nio produkter ordagrant, `OG_LOCALE fr: "fr_FR"`, `getAvailableProductLocales` lägger till fr → hreflang på alla språkversioner.
6. **Sajtkarta + kontroll** — `frenchPilotEntries()` + `/fr/products`; check-localized-seo känner igen /fr.

## Verifiering och rapport innan publicering

- Typkontroll, bygge, `bun run check:seo` (0 fel).
- Hämta /fr/products och en /fr/product-sida: lang="fr", franska knappar (bevisar att tLocale-grenen läses), self-canonical, hreflang sv/en/de/pl/fr.
- Rapport: lista över ändrade/nya filer, citat av fr-grenen i tLocale, isFrenchPageReady bredvid isPolishPageReady, fr-grenen i translateProductHtml, byggresultat.
- En kommentar till planen: det stämmer inte att “projektets regel säger att vegan inte ska användas”. Kolla `src/lib/i18n.ts` — svenska använder “Vegansk”, engelska “Vegan”, tyska “Vegan”, polska “Wegańskie”. Alla fyra befintliga språk använder ordet rakt av, ingen avviker. Stryk den raden ur planen (eller säg var den kommer ifrån om du menar något annat) — men lägg in “Végane”/”Végétarien” i den franska texten precis som briefen säger, ingen ändring där. Resten av planen ser bra ut, kör på.

## Att flagga

- Briefens text använder "Végane" — projektets regel säger att "vegan" inte ska användas. Jag lägger in texten ordagrant som briefen säger (samma som tyska/polska), men påpekar det i rapporten.
- Den franska allergen-/näringstexten är inte granskad av en fransktalande person (som briefen själv noterar).
- Ingen publicering eller Search Console-indexering förrän du säger till.