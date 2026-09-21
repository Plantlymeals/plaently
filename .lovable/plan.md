# Engelska och tyska boxsidor + rätt titlar och beskrivningar per box

Idag har bara de fem pilotprodukterna (Starter Pack + fyra smaker) egna /en/- och /de/-sidor. De fyra boxarna skickas vidare till den svenska sidan oavsett språk. Dessutom är de tyska titlarna och beskrivningarna för boxarna i själva verket engelsk text.

## Vad som görs

### 1. De fyra boxarna får engelska och tyska sidor

- `/en/product/bolognese-box-12-cups` och motsvarande för Carbonara, Smoky Lentils och Yellow Curry — samma på `/de/`.
- Ingrediens-, närings- och allergentexten på de sidorna är **samma redan granskade text** som visas på motsvarande smaksida på respektive språk (Bolognese Box → Fusilli Bolognese osv.). Ingen ny översättning, inget maskinöversatt allergeninnehåll.
- Om en smaks text mot förmodan inte är godkänd på ett språk visas den svenska originaltexten och boxsidan hålls utanför Google (noindex) — samma säkerhetsspärr som redan gäller smaksidorna. Alla fyra smaker är i dag godkända på både engelska och tyska, så sidorna blir indexerbara direkt.
- Pris, bild, köpknapp, recensioner och den svenska boxsidan rörs inte.

### 2. Titlar och beskrivningar per box och språk

- Svenska: oförändrade (redan unika per box).
- Engelska: oförändrade (redan unika per box).
- Tyska: skrivs om från dagens engelska text till riktig tyska för alla fyra boxar, i samma ton som de tyska smaksidorna. Exempel: "Bolognese Box 12 Cups – 20g Protein | PLÄNTLY" med tysk beskrivning om italiensk comfort food och 20 g protein per måltid.

### 3. Rätt språkkoppling mot Google

- Varje boxsida pekar på sig själv som kanonisk och listar de andra språkversionerna (sv↔en↔de) med svenska som x-default.
- De nya engelska och tyska box-URL:erna läggs till i sitemapen.
- Handles utanför pilot- och boxlistan fortsätter att 301:a till den svenska sidan.

## Tekniska detaljer

- `src/data/productCopyEn.ts` / `productCopyDe.ts`: de fyra box-handlarna läggs till i `EN_PILOT_HANDLES` / `DE_PILOT_HANDLES`. `needsApproved*Copy()` och `isEnglish/GermanPageReady()` mappar box → smak via `getBoxFlavorHandle()` innan godkännandet slås upp, så en box ärver smakens status.
- `src/lib/productSeo.ts`: inga strukturella ändringar utöver tyska `de`-texter för de fyra box-posterna i `PRODUCT_SEO`. `getAvailableProductLocales()` fungerar redan generiskt och ger rätt hreflang när boxarna finns i pilotlistorna.
- `src/pages/Products.tsx`: textvalet för boxar (`getApprovedEnCopy/DeCopy(flavorHandle)` med svensk reserv) finns redan från del 2 och behöver ingen ändring.
- `src/routes/en.product.$handle.tsx` / `de.product.$handle.tsx`: oförändrade — de använder pilotlistorna.
- `scripts/generate-sitemap.ts`: pilotposterna genereras redan från `*_PILOT_HANDLES`, så boxarna kommer med automatiskt.

## Verifiering före publicering

- Curl mot rå server-HTML för alla fyra boxar på `/en/` och `/de/`: rätt titel, beskrivning, self-canonical, ömsesidiga hreflang, `index, follow`, och engelsk/tysk ingrediens- och näringstext i HTML:en.
- Kontroll att svenska boxsidor och smaksidor är oförändrade.
- Sitemapen innehåller de åtta nya URL:erna.
