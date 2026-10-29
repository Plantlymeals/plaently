# Spansk produktpilot (/es)

Samma mönster som den franska piloten: nio produktsidor + /es/products, spansk text exakt från briefen (approved: true). Inga spanska kategorisidor.

## Vad som byggs
- 9 spanska produktsidor under `/es/product/...` och en översikt på `/es/products`.
- Spanska knappar/formulärtexter (47 nycklar), spanska titlar och beskrivningar för Google, `lang="es"`, es_ES.
- Sajtkartan får 10 nya spanska adresser; alla andra språk får en hreflang-länk till spanska.
- Footerns kategorilänkar på spanska sidor pekar på de svenska kategorisidorna.
- Okända `/es/`-produkter skickas vidare till svenska sidan (som /fr och /pl).

## Teknisk sammanfattning
- `src/lib/i18n.ts`: `ProductPageLocale` + `"es"`, `productPageEs`, och uttrycklig `es`-gren i `tLocale()` i samma steg.
- Ny `src/data/productCopyEs.ts` (från briefen). Jämför `isSpanishPageReady()` mot nuvarande `isFrenchPageReady()` och flagga om de skiljer sig.
- Nya `src/routes/es.product.$handle.tsx` och `es.products.tsx` (kopior av fr, med "Producto no encontrado"-sidan från briefen).
- `productSeo.ts`: es-poster för 9 produkter, `OG_LOCALE.es = "es_ES"`, `getAvailableProductLocales` + es.
- `productDescription.ts`: es följer fr/pl-regeln (aldrig maskinöversättning).
- `productSchema.ts` (es-ES), `SEOHead.tsx` (KEYWORDS.es), `Breadcrumbs.tsx` ("Inicio"), `Header.tsx`/`Footer.tsx` ("Productos", es-produktlänkar), `__root.tsx` (lang="es"), `Products.tsx` (es-grenar), `categoryContent.ts` (exkludera es från CategoryLocale).
- `scripts/generate-sitemap.ts`: `spanishPilotEntries()` + `/es/products`. `scripts/check-localized-seo.ts`: känner igen `/es`.

## Verifiering före publicering
- Typkontroll + bygge, sajtkarta, `check:seo` 0 fel.
- Hämta en /es-sida: lang="es", spansk titel, självkanonisk, hreflang sv/en/de/pl/fr/es, spansk knapptext (bevisar att tLocale-grenen läses).
- Rapport med filista, citat av `tLocale`-grenen, `isSpanishPageReady` bredvid `isFrenchPageReady`, bekräftelse om `translateProductHtml` och footern.

Egen översättning (ej i briefen) flaggas: "Productos", "Inicio", reservtitlar.
