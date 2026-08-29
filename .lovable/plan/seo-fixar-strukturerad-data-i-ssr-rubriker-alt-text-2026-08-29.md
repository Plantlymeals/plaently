# SEO-fixar: strukturerad data i SSR, rubriker, alt-text

## Vad jag hittade när jag kontrollerade den live-sajten

Flera av punkterna är redan lösta i koden — men tre av dem syns inte för Google, eftersom de bara byggs i webbläsaren efter att sidan laddats.

- **Produkt-schema finns** (namn, beskrivning, bild, brand, pris, lagerstatus, betyg) men renderas via Helmet först i webbläsaren. Live-HTML för `/product/plant-based-fusilli-bolognese` innehåller **noll** Product-schema. Samma sak för alla produktsidor.
- **FAQ-schema finns** på `/faq`, men byggs av data som hämtas i webbläsaren — live-HTML innehåller **noll** FAQPage-schema.
- **Organization + WebSite-schema finns redan** i server-HTML på startsidan. Klart, ingen åtgärd.
- **`<html lang="sv">` är redan satt** korrekt på live-sajten. Ingen åtgärd.
- **Rubriknivåer**: i koden går `/products` H1 → H2 (produktkorten) utan hopp; produktsidor går H1 → H2. Den rapporterade H1→H3-luckan kommer troligen från att sidan mättes i ett laddningsläge. Jag gör en verifieringsrunda på renderad HTML per sida och rättar bara om det verkligen hoppar.
- **plaently.se svarar redan med 301** (permanent) till plaently.com. Enda finlir: den går till `http://www.plaently.com` — ett extra hopp. Jag kan inte ändra det från koden; det ligger hos domän-/DNS-leverantören. Jag beskriver exakt vad du ska ändra.
- **Alt-text**: startsidans hero är ren text/gradient (ingen bild), så "hero-bild utan alt" stämmer inte där. Övriga bilder jag hittade har alt. Jag gör en fullständig genomsökning av renderade sidor och lägger till beskrivande svensk alt-text där något saknas.

## Vad som byggs

### 1. Produkt-schema i server-HTML (huvudfixen)
Produktrutten får en server-side loader som hämtar pris, valuta och lagerstatus från Shopify Storefront API (riktiga priser, inget påhittat) samt betygsdata från databasen. JSON-LD byggs i ruttens `head()` så att fullständig Product-schema med `name`, `description`, `image`, `brand`, `offers` (pris, SEK, availability) och `aggregateRating` (endast om recensioner finns) ligger i den råa HTML-koden vid första svaret. Gäller alla 12 produkter: fyra måltider, starter pack, monthly box, office pack, big office pack och de fyra 12-pack-boxarna.

Det befintliga klientsidiga schemat tas bort så att sidan inte får dubbla Product-block.

### 2. FAQ-schema i server-HTML
`/faq` får en loader som läser publicerade frågor/svar från databasen på servern och genererar FAQPage-schema i ruttens `head()` med exakt samma text som visas på sidan (svenska när svenska finns). Det klientsidiga Helmet-blocket tas bort.

### 3. Rubriker och alt-text
Genomgång av renderad HTML på startsidan, /products, produktsidor, /faq, /about, /nutrition, /lifestyle, /contact, /blog och kategorisidorna:
- rätta eventuella rubrikhopp (H1 → H3) genom att lägga in en H2-nivå eller lyfta H3 till H2 där avsnittet faktiskt är toppnivå,
- lägga till beskrivande svensk alt-text på bilder som saknar det (t.ex. "Måltidskopp med Fusilli Bolognese – klar på 5 minuter med kokande vatten").

Ingen visuell design ändras — rubrikändringar behåller nuvarande typsnitt och storlekar via klasser.

### 4. Domänredirect
Redovisar nuvarande status (301 finns redan) och ger dig exakt inställning för att peka plaently.se direkt till `https://plaently.com` utan mellanhopp.

### 5. Verifiering efter publicering
- Kontroll att Product- och FAQPage-schema finns i rå server-HTML på alla berörda sidor.
- Validering mot Googles Rich Results Test för en produktsida och /faq.
- Ny SEO-granskning körs och resultatet sammanfattas.

## Tekniska detaljer

- `src/routes/product.$handle.tsx`: `loader` hämtar Shopify-variant (pris/valuta/availability) + `product_reviews`-aggregat; `head()` utökas med `scripts: [{ type: "application/ld+json", children: ... }]`. Bild via befintliga `resolveProductImageUrl`, text via `PRODUCT_SEO` i `src/lib/productSeo.ts`.
- Ny hjälpare `buildProductJsonLd` i `src/lib/productSeo.ts` (eller `productSchema.ts`) så att både SSR och ev. klientkod använder samma källa.
- `src/pages/Products.tsx`: tar bort `jsonLd`-prop till `SEOHead` på produktdetaljsidan.
- `src/routes/faq.tsx`: `loader` med Supabase publishable-klient (anon-läsning av `faqs`), `head()` bygger FAQPage-schemat; `src/pages/FAQ.tsx` tappar sitt Helmet-block och läser loader-data.
- Shopify-anrop på servern använder Storefront API 2025-07 som redan konfigurerats i `src/lib/shopify.ts`; loadern faller tillbaka till schema utan `offers` om anropet fallerar, så sidan aldrig blockeras.
