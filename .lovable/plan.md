# Server-rendera produktlistan på /products

Idag levererar `/products` ett tomt skal till Google och till besökare med långsam uppkoppling: `<main>` innehåller breadcrumb, H1 och sedan en spinner. Produkterna hämtas i `useEffect`, som aldrig körs under serverrendering. Den här planen flyttar hämtningen till servern så att produktkorten, priserna och produkt-JSON-LD finns i HTML:en direkt.

Omfattning: endast produktlistan `/products`. Produktdetaljsidorna (`/product/$handle`) rörs inte i det här steget.

## Vad som ändras

**1. Ny serverfunktion för produktdata**

En ny fil `src/lib/products.functions.ts` med en `createServerFn` som:
- Anropar Shopify Storefront API på servern och returnerar de fält listan behöver (titel, handle, pris, valuta, bild-URL, alt-text, tags).
- Hämtar bildöverstyrningar från `products`-tabellen (slug + image_url) i samma anrop.
- Returnerar ett rent, serialiserbart DTO — inga klasser, inga funktioner.
- Tillämpar samma filtrering som listan gör idag (paket/"pack"/"box"/"taster" exkluderas) så att resultatet matchar det som visas nu, exakt.

Shopify-token läses i handlern. Den nuvarande `VITE_SHOPIFY_STOREFRONT_TOKEN` är redan publik (storefront-tokens är avsedda att exponeras), så samma värde kan användas server-side utan nya hemligheter.

**2. Route-loader på /products**

`src/routes/products.tsx` får en `loader` som anropar serverfunktionen, plus en utökad `head()` som lägger till `ItemList`-JSON-LD med produkternas namn, URL:er och priser — server-renderat.

**3. Komponenten renderar loader-datan direkt**

`src/pages/Products.tsx` (grid-komponenten, rad 306+) läser produkterna via `getRouteApi("/products")` istället för att starta i `loading = true`. Spinnern försvinner ur den server-renderade HTML:en och korten finns där direkt. Befintlig markup, styling, filtrering och `useBundleMix`-logik för "lägg i varukorg" behålls oförändrad — bara datakällan byts.

`ProductDetail` i samma fil lämnas orörd.

## Vad som INTE ändras

- Ingen visuell förändring. Samma kort, samma layout, samma texter.
- Varukorg, Shopify-checkout, i18n (SV/EN) och routing rörs inte.
- Produktdetaljsidorna behåller sitt nuvarande beteende.

## Verifiering före publicering

Efter ändringen körs samma curl-kommandon som du använde, mot preview och sedan mot produktion efter publicering:

```
curl -s -A "Mozilla/5.0" <url>/products | grep -o "SEK" | wc -l
curl -s -A "Mozilla/5.0" <url>/products | grep -c "lägg i varukorg"
curl -s -A "Mozilla/5.0" <url>/products | grep -o '"@type":"ItemList"' | wc -l
curl -s -A "Mozilla/5.0" <url>/products | sed -n '/<main/,/<\/main>/p'
```

Godkänt = produktnamn och priser finns i `<main>`, ItemList-JSON-LD finns, ingen spinner. Jag klistrar in den råa outputen, inte en sammanfattning.

Dessutom: visuell jämförelse i preview (desktop + mobil) mot nuvarande sida, och kontroll att "lägg i varukorg" fortfarande fungerar efter hydrering.

## Tekniska detaljer

- Berörda filer: `src/lib/products.functions.ts` (ny), `src/routes/products.tsx` (loader + ItemList-schema), `src/pages/Products.tsx` (grid-komponenten läser loader-data).
- `createServerFn` från `@tanstack/react-start`; loadern anropar den, `head({ loaderData })` bygger JSON-LD.
- Om Shopify-anropet fallerar på servern returnerar serverfunktionen en tom lista med felflagga; komponenten faller då tillbaka på ett klientanrop, så sidan aldrig blir tom för riktiga besökare.
- `src/lib/shopify.ts` importerar `sonner` på modulnivå — serverfunktionen använder därför en egen, toast-fri hämtningsväg istället för att importera den filen, så att ingen UI-kod dras in i servergrafen.
