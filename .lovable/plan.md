# SEO-optimering av PLÄNTLY (utan designändringar)

Ingen visuell redesign, inga nya färger/typsnitt/layouter, inga konkurrentjämförelser. Allt nedan är metadata, semantik, innehållstext och teknisk SEO.

## Krock med tidigare arbete (viktigt)

I förra rundan lades en jämförelsetabell (PLÄNTLY vs proteinpulver / äta ute / laga själv) till på de proteinrika och plantbaserade kategorisidorna. Din nya instruktion säger att sådana jämförelser ska bort. Planen tar därför bort tabellerna igen och ersätter dem med en egen "20g protein. Made for real life."-sektion i samma kortdesign som redan finns på sidorna. Övrigt från förra rundan (kort svar-block, FAQ med H3, interna länkar) behålls.

## 1. Metadata som byts ut

| Sida | Nytt |
|---|---|
| `/` | Title + description enligt din text (route `head()` i `src/routes/index.tsx`) |
| `/products` | Title + description enligt din text (ny route-`head()`, ersätter dagens i18n-drivna `SEOHead`) |
| `/nyttig-snabbmat` | Title + description enligt din text |
| `/high-protein-meals` | Title + description enligt din text (svensk text på engelsk URL enligt din spec — se fråga nedan) |
| `/plant-based-meals` | Title + description enligt din text (samma fråga) |
| `/proteinkoppar` | Title + description enligt din text |

Alla H1 lämnas oförändrade.

## 2. Textfixar

- `Protein måltider` → `Proteinmåltider`
- `Välj bland våra, protein och fiberrika smaker.` → `Välj bland våra protein- och fiberrika smaker.`

Båda ligger i `src/lib/i18n.ts`.

## 3. /high-protein-meals + /plant-based-meals

- Ta bort jämförelsetabellen (data + rendering).
- Ny egen-varumärkessektion: rubrik "20g protein. Made for real life." med fyra användningsfall — På jobbet / Efter träning / På språng / Hemma. Återanvänder befintlig kort-styling.
- Gå igenom miljö- och näringspåståenden på plantbaserade sidan: ta bort ostödda jämförelser/siffror, behåll faktiska näringsvärden. Vegan (Fusilli Bolognese, Smoky BBQ Lentils) vs vegetarisk med mjölkprotein (Pasta Carbonara, Yellow Curry & Rice) förblir tydligt utskrivet.

## 4. Strukturerad data

- Verifiera att Organization + WebSite bara finns en gång (startsidan) och inte dupliceras via Helmet.
- Product/Offer på produktsidor: kontrollera att pris, valuta, availability och bild matchar synligt innehåll.
- BreadcrumbList på kategori- och produktsidor.
- FAQPage endast där FAQ faktiskt syns på sidan.
- Article på blogginlägg med författare, publicerings- och uppdateringsdatum.

## 5. Hreflang, canonical, sitemap, robots

- Bekräfta att varje sida har självrefererande canonical och exakt tre hreflang (sv, en, x-default → svensk URL). Fixas där avvikelse hittas.
- `robots.txt`: behåll WordPress-arvet men lägg till `Allow: /` och `Disallow: /products?q=` samt `Disallow: /admin`, `/unsubscribe`.
- Sökparametrar (`/products?q=...` m.fl.): canonical pekar på ren `/products` och `noindex` på parametriserade varianter så de inte skapar tunna dubbletter.
- Sitemap: kontrollera att alla indexerbara sv- och en-URL:er finns med och att inget admin/utility ligger kvar.

## 6. Produktcrawlbarhet (teknisk kontroll)

Produktsidorna hämtar Shopify-data i `useEffect` (klientsidan). Titel, description och canonical är redan SSR:ade via route-`head()`, men produktnamn, H1, pris, tillgänglighet och näringsinnehåll renderas först efter JS.

Åtgärd: flytta produkthämtningen till en route-loader (server-side) så att Googlebot får H1, beskrivning, pris, availability och bild direkt i HTML. Checkoutflöde, Shopify-integration och URL:er är oförändrade.

## 7. Intern länkning + Open Graph

- Behåll och komplettera de kontextuella länkarna mellan start → produkter → kategorisidor → produktsidor → blogg, med naturlig ankartext (inte upprepad exakt-match).
- Verifiera att varje viktig sida har og:title, og:description, og:image, og:url, og:type samt twitter-kort. Befintliga produktbilder används.

## 8. Rapport

Efter genomförandet får du en sammanställning: ändrat, redan korrekt, metadata, schema, canonical, hreflang, sitemap, robots, produktcrawlbarhet och kvarvarande manuella åtgärder.

## Teknisk sammanfattning

Filer som berörs: `src/routes/index.tsx`, `src/routes/products.tsx` (ny `head()`), `src/data/categoryContent.ts`, `src/pages/categories/CategoryPage.tsx`, `src/lib/i18n.ts`, `src/pages/Products.tsx` + `src/routes/product.$handle.tsx` (loader), `public/robots.txt`, `scripts/generate-sitemap.ts`. Inga nya routes, inga URL-ändringar, inga designtokens rörs.

## Öppen fråga

Din spec anger svenska titlar/descriptions för de engelska URL:erna `/high-protein-meals` och `/plant-based-meals`. Idag har de engelsk metadata och deras svenska motsvarigheter (`/proteinrika-maltider`, `/plantbaserade-maltider`) har svensk. Jag föreslår att lägga din svenska text på de svenska URL:erna och behålla engelsk metadata på de engelska — annars bryts hreflang-logiken. Säg till om du hellre vill ha svenskan exakt på de engelska URL:erna.
