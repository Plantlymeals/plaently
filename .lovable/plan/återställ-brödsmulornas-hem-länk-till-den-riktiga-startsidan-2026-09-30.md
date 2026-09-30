# Återställ brödsmulornas Hem-länk till den riktiga startsidan

## Ändringar

- **`src/components/Breadcrumbs.tsx`**
  - Ta bort den valfria `homePath`-egenskapen.
  - Återställ Hem/Home/Startseite-länken till `/` för alla språk.
  - Behåll den språkberoende synliga etiketten och strukturerade datan.

- **`src/pages/Products.tsx`**
  - Ta endast bort `homePath`-konstanten och `homePath={homePath}` från produktens brödsmulor.
  - Behåll `productsListPath` och samtliga tre språkmedvetna produktlänkar oförändrade.

- **`src/pages/categories/CategoryPage.tsx`**
  - Ta endast bort `homePath`-konstanten och `homePath={homePath}`.
  - Behåll `pagePath`, `productsPath` och övriga lokaliserade länkar oförändrade.

## Avgränsning

- Ändra inga andra filer eller länkar i sidhuvud/sidfot.
- Låt Monthly Box, Office Pack och Big Office Pack fortsätta länka till sina svenska sidor; den kända varningen är avsiktlig.
- Ändra inte SEO-kontrollens regler för att dölja verkliga 404-länkar.

## Verifiering

- Kör `bun run check:seo` och bekräfta **0 fel**, med endast den kända varningen för de tre paketen.
- Kontrollera engelska och tyska produkt- och kategorisidor: Home/Startseite ska gå till `/`, medan Products/Produkte ska gå till `/en/products` respektive `/de/products`.
- Kontrollera svenska motsvarigheter: Hem ska gå till `/` och Produkter till `/products`.
