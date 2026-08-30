# Server-rendera produktlistan på /products

Idag levererar `/products` ett tomt skal till Google och till besökare med långsam uppkoppling: `<main>` innehåller breadcrumb, H1 och sedan en spinner. Produkterna hämtas i `useEffect`, som aldrig körs under serverrendering. Den här planen flyttar hämtningen till servern så att produktkorten, priserna och produkt-JSON-LD finns i HTML:en direkt.

Omfattning: endast produktlistan `/products`. Produktdetaljsidorna (`/product/$handle`) rörs inte i det här steget.

## Låst krav: EN delad filterfunktion

Filterlogiken som utesluter paket/"pack"/"box"/"taster" finns idag inline i `src/pages/Products.tsx` (rad 348–351, villkoret med `getBundleCupsFromTitle` + `!title.includes(...)`). Den är inte exporterad.

Därför gäller:

**0. Bryt ut filterfunktionen (görs först)**

En ny fil `src/lib/productFilters.ts` exporterar exakt en funktion, t.ex. `isListableProduct(title: string): boolean`, som innehåller dagens villkor oförändrat. `Products.tsx` ändras så att grid-filtret på rad 348–351 anropar denna funktion istället för det inline-villkoret. Ingen ny kopia av logiken skapas någonstans — detta är den enda implementationen.

Bekräftelse av kraven:
1. Den delade filterfunktionen ligger i `src/lib/productFilters.ts` (ren logik, inga UI-imports, säker att använda både på server och klient).
2. Både server-rendering (loader + ItemList-JSON-LD) och klient-rendering (inklusive fallback-hämtning om serveranropet fallerar) går genom exakt samma funktion.

## Vad som ändras

**1. Ny serverfunktion för produktdata**

En ny fil `src/lib/products.functions.ts` med en `createServerFn` som:
- Anropar Shopify Storefront API på servern och returnerar de fält listan behöver (titel, handle, pris, valuta, bild-URL, alt-text, tags).
- Hämtar bildöverstyrningar från `products`-tabellen (slug + image_url) i samma anrop.
- Filtrerar listan via den importerade `isListableProduct` från `src/lib/productFilters.ts` — ingen egen implementation av villkoret.
- Returnerar ett rent, serialiserbart DTO — inga klasser, inga funktioner.
- Filen hålls som en tunn wrapper: endast imports + `createServerFn`-deklarationer; Shopify-frågan och hjälpkod ligger i en separat `*.server.ts`-modul som importeras.

Shopify-token läses i handlern. Den nuvarande `VITE_SHOPIFY_STOREFRONT_TOKEN` är redan publik (storefront-tokens är avsedda att exponeras), så samma värde kan användas server-side utan nya hemligheter.

**2. Route-loader på /products**

`src/routes/products.tsx` får en `loader` som anropar serverfunktionen, plus en utökad `head()` som lägger till `ItemList`-JSON-LD med produkternas namn, URL:er och priser — server-renderat, byggt från samma filtrerade lista som komponenten renderar.

**3. Komponenten renderar loader-datan direkt**

`src/pages/Products.tsx` (grid-komponenten, rad 306+) läser produkterna via `getRouteApi("/products")` istället för att starta i `loading = true`. Spinnern försvinner ur den server-renderade HTML:en och korten finns där direkt. Befintlig markup, styling, sortering och `useBundleMix`-logik för "lägg i varukorg" behålls oförändrad — bara datakällan byts.

Fallback: om serverfunktionen returnerar felflagga (t.ex. Shopify nere) gör komponenten det gamla klientanropet en gång, och den filtrerade renderingen använder även då `isListableProduct` från samma modul.

`ProductDetail` i samma fil lämnas orörd.

## Vad som INTE ändras

- Ingen visuell förändring. Samma kort, samma layout, samma texter.
- Varukorg, Shopify-checkout, i18n (SV/EN) och routing rörs inte.
- Produktdetaljsidorna behåller sitt nuvarande beteende.
- Filtervillkoren ändras inte — bara var de bor i koden.

## Verifiering före publicering

Efter ändringen körs samma curl-kommandon som du använde, mot preview och sedan mot produktion efter publicering:

```
curl -s -A "Mozilla/5.0" <url>/products | grep -o "SEK" | wc -l
curl -s -A "Mozilla/5.0" <url>/products | grep -c "lägg i varukorg"
curl -s -A "Mozilla/5.0" <url>/products | grep -o '"@type":"ItemList"' | wc -l
curl -s -A "Mozilla/5.0" <url>/products | sed -n '/<main/,/<\/main>/p'
```

Godkänt = produktnamn och priser finns i `<main>`, ItemList-JSON-LD finns, ingen spinner, och paket/box-produkter förekommer fortfarande INTE i listan (filterverifiering i samma råa output). Jag klistrar in den råa outputen, inte en sammanfattning.

Dessutom: visuell jämförelse i preview (desktop + mobil) mot nuvarande sida, och kontroll att "lägg i varukorg" fortfarande fungerar efter hydrering.

## Tekniska detaljer

- Berörda filer: `src/lib/productFilters.ts` (ny, delad filterfunktion), `src/lib/products.functions.ts` (ny, tunn wrapper), ev. `src/lib/products.server.ts` (ny, Shopify-fråga/hjälpkod), `src/routes/products.tsx` (loader + ItemList-schema), `src/pages/Products.tsx` (grid-komponenten läser loader-data och anropar den delade filterfunktionen).
- `createServerFn` från `@tanstack/react-start`; loadern anropar den, `head({ loaderData })` bygger JSON-LD.
- `src/lib/shopify.ts` importerar `sonner` på modulnivå — serverfunktionen använder därför en egen, toast-fri hämtningsväg istället för att importera den filen, så att ingen UI-kod dras in i servergrafen.
