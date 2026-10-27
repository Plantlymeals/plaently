# Polsk pilot: nio produktsidor på /pl/ (AI-översatt, godkänd direkt)

Enligt den nya briefen (beslut 27 okt): Starter Pack, fyra smaker och fyra boxar på `/pl/product/...`, plus `/pl/products`. Den polska produkttexten från briefen läggs in ordagrant med `approved: true`, så sidorna blir indexerbara och hamnar i sajtkartan direkt. Kategorisidorna ingår inte den här gången.

## 1. Språktypen först

`ProductPageLocale` i `src/lib/i18n.ts` blir `"sv" | "en" | "de" | "pl"`. Typkontrollen används för att hitta varje ställe som väljer text efter språk, och varje ställe får en egen `pl`-gren. Ingen gren lånas från `de` eller `en`.

Ny ordbok `productPagePl` med samma nycklar som `productPageDe` (knappar, etiketter som "Produkty", fraktrader och liknande). Briefen innehåller inte de här korta knapptexterna, så jag översätter dem från tyskan. Saknas en nyckel visas svenska, aldrig en tom sträng.

## 2. `src/data/productCopyPl.ts`

Skapas ordagrant från briefen: `PL_PILOT_HANDLES`, `isPolishPilotHandle()`, `PL_PRODUCT_COPY` (fyra smaker, `approved: true`), `getApprovedPlCopy()`, `hasApprovedPlCopy()` och `isPolishPageReady()`. Innan filen skrivs jämförs `isPolishPageReady()` med hur `isGermanPageReady()` faktiskt ser ut i koden: paketen och boxarna är klara direkt, och smakerna kräver polsk godkänd text.

## 3. Nya sidor

- `pl.product.$handle.tsx`: kopia av den tyska sidan med `pageLocale: "pl"` och den polska sidan "Nie znaleziono produktu" från briefen. Handtag utanför piloten skickas vidare (301) till den svenska sidan.
- `pl.products.tsx`: kopia av `de.products.tsx`. Länkarna från produktsidorna (brödsmulor, "tillbaka", sidan som inte hittas) pekar hit, så sidan behövs för att de inte ska ge 404.

## 4. Delade filer

- `Products.tsx`: polsk text hämtas med `getApprovedPlCopy()`, som importeras uttryckligen. Saknas den visas svensk originaltext. Brödsmulan "Produkty" och länkar till `/pl/products`.
- `productDescription.ts` (`translateProductHtml`): en uttrycklig `pl`-gren med en kommentar om att polska aldrig maskinöversätts och att svenska originalet visas.
- `productSeo.ts`: polska titlar och beskrivningar från briefen för de nio produkterna, `/pl/`-adresser, `pl_PL`, och hreflang `pl` på alla språkversioner med självreferens. Hreflang `pl` läggs till i produktlistans head.
- `productSchema.ts`, `SEOHead.tsx`, `Breadcrumbs.tsx`, `Header.tsx` (som känner igen `/pl` och visar "Produkty"), `Footer.tsx` (produktlänkar på `/pl/`-sidor) och `__root.tsx` (`<html lang="pl">`).
- `scripts/check-localized-seo.ts`: lär sig att `/pl` är polska.

## 5. Sajtkarta

`scripts/generate-sitemap.ts` får polska poster: de nio produktsidorna, där bara de som är klara enligt `isPolishPageReady()` tas med, plus `/pl/products`.

## Rörs inte

Svenska, engelska och tyska texter, kategorisidorna, den globala sv/en-växlaren, marknad, frakt och valuta, Shopify och Search Console.

## Innan publicering visar jag

- Varje ändrad och ny fil med en rad om varför.
- Kodcitat av `isPolishPageReady()` bredvid `isGermanPageReady()`, och av den polska grenen i `translateProductHtml`.
- Resultat av typkontroll, bygge och `bun run check:seo`.
- Serverrenderad HTML för en smak på `/pl/`: polsk produkttext, `index, follow`, självrefererande canonical och hreflang åt båda hållen mellan sv, en, de och pl.
- "`tLocale()` i `src/lib/i18n.ts` (ca rad 599) har idag bara ett `if (locale === "de")`-fall, inte en uttömmande switch — så det blir inget kompileringsfel som tvingar fram ett `pl`-fall bara för att `ProductPageLocale` utökas. Lägg till en egen `else if (locale === "pl") return productPagePl[key] ?? tLocale(key, "sv");`-gren i den funktionen, inte bara en ny `productPagePl`-ordbok. Visa mig den exakta raden i sammanfattningen innan publicering."

## Att observera

Briefens del 3 nämner också polska kategorisidor, men omfattningen i början säger "inte kategorisidorna". Planen följer omfattningen. Säg till om du vill ha dem med.