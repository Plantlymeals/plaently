# SEO-optimering av PLÄNTLY (utan designändringar)

Ingen visuell redesign, inga nya färger/typsnitt/layouter, inga konkurrentjämförelser. Allt nedan är metadata, semantik, innehållstext och teknisk SEO. SSR, checkout, Shopify och analytics rörs inte.

## 1. Jämförelsetabellerna tas bort

Tabellen (PLÄNTLY vs proteinpulver / äta ute / laga själv) togs in i förra rundan på `/high-protein-meals` och `/plant-based-meals`. Den tas nu bort helt — både data i `src/data/categoryContent.ts` och renderingen i `CategoryPage.tsx`.

Ersätts på `/high-protein-meals` av ett eget avsnitt: **"20g protein. Gjort för verkliga livet."** med fyra användningsfall — På jobbet / Efter träning / På språng / Hemma — i samma kortstil som sidans befintliga fördelskort. Kort svar-blocket, FAQ (H3) och interna länkar behålls orörda.

## 2. Metadata som byts ut

| Sida | Ny title |
|---|---|
| `/` | PLÄNTLY \| Hälsosam snabbmat med 20g protein |
| `/products` | Proteinmåltider \| 20g protein på 5 min \| PLÄNTLY |
| `/nyttig-snabbmat` | Hälsosam snabbmat \| 20g protein på 5 min \| PLÄNTLY |
| `/proteinrika-maltider` | Proteinrika måltider \| 20g protein \| PLÄNTLY |
| `/plantbaserade-maltider` | Plantbaserade måltider \| 20g protein \| PLÄNTLY |
| `/proteinkoppar` | Proteinkoppar \| 20g protein på 5 min \| PLÄNTLY |

Descriptions enligt din text. Alla H1 lämnas oförändrade. `/products` får en egen route-`head()` istället för dagens i18n-drivna `SEOHead`, så titeln blir stabil vid SSR.

**Språkval:** din svenska text läggs på de svenska URL:erna (`/proteinrika-maltider`, `/plantbaserade-maltider`, `/nyttig-snabbmat`, `/proteinkoppar`). De engelska motsvarigheterna (`/high-protein-meals`, `/plant-based-meals`, `/healthy-fast-food`, `/protein-cups`) behåller engelsk metadata — annars bryts hreflang-parkopplingarna du bad mig lämna orörda. Innehållsändringarna (borttagen tabell, nytt fördelsavsnitt) görs på båda språkversionerna.

Ingen `/halsosam-snabbmat`-sida skapas.

## 3. Textfixar

- `Protein måltider` → `Proteinmåltider`
- `Välj bland våra, protein och fiberrika smaker.` → `Välj bland våra protein- och fiberrika smaker.`

Båda ligger i `src/lib/i18n.ts`.

## 4. Ostödda påståenden på plantbaserade sidorna

"Upp till 90% mindre CO2 än nötkött" / "Up to 90% lower CO2 vs beef" finns i två block per språk. Dessa formuleringar tas bort och ersätts med påståenden som håller utan källa (växtbaserat protein, näringsvärden som faktiskt står på förpackningen). Faktiska näringsvärden behålls.

Vegan (Fusilli Bolognese, Smoky BBQ Lentils) vs vegetarisk med mjölkprotein (Pasta Carbonara, Yellow Curry & Rice) förblir tydligt utskrivet. Befintlig FAQ-formulering om växtbaserat vs veganskt rörs inte.

## 5. Strukturerad data

- Organization + WebSite endast en gång (startsidan), ingen dubblering via Helmet.
- Product/Offer på produktsidor: pris, valuta, availability och bild ska matcha synligt innehåll.
- BreadcrumbList på kategori- och produktsidor.
- FAQPage endast där FAQ syns på sidan.
- Article på blogginlägg med författare samt publicerings- och uppdateringsdatum.

## 6. Canonical, hreflang, sitemap, robots

- Verifiera att varje sida har självrefererande canonical och exakt tre hreflang (sv, en, x-default → svensk URL). Fixas bara där avvikelse hittas; kopplingarna ändras inte.
- `robots.txt`: behåll WordPress-arvet, lägg till `Allow: /`, `Disallow: /products?q=`, `Disallow: /admin`, `Disallow: /unsubscribe`.
- Parametriserade URL:er (`/products?q=...` m.fl.): canonical mot ren `/products` + `noindex` på parametervarianter.
- Sitemap: kontrollera att alla indexerbara sv- och en-URL:er finns med och att admin/utility inte ligger kvar.
- Språkväxlaren kontrolleras så den använder riktiga länkar, inte enbart JS-onclick.

## 7. Produktcrawlbarhet

Produktsidornas Shopify-data hämtas idag i `useEffect`. Title/description/canonical är redan SSR:ade, men produktnamn, H1, pris, tillgänglighet och näringsinnehåll renderas först efter JS. Hämtningen flyttas till en route-loader så Googlebot får allt direkt i HTML. Checkout, Shopify-integration och URL:er är oförändrade. Bild-ALT-texter gås igenom och görs beskrivande.

## 8. Intern länkning + Open Graph

- Behåll och komplettera kontextuella länkar: start → produkter → kategorisidor → produktsidor → blogg, med naturlig varierad ankartext.
- Verifiera att varje viktig sida har og:title, og:description, og:image, og:url, og:type samt twitter-kort, med befintliga produktbilder.

## 9. Blogg

Arkitekturen behålls, inga nya artiklar genereras. Endast kontroll av att befintliga inlägg har Article-schema, canonical, OG och interna länkar.

## 10. Rapport

Efter genomförandet får du en sammanställning: ändrat, redan korrekt, metadata, schema, canonical, hreflang, sitemap, robots, produktcrawlbarhet och kvarvarande manuella åtgärder.

## Teknisk sammanfattning

Filer som berörs: `src/routes/index.tsx`, `src/routes/products.tsx` (ny `head()`), kategoriroutes för de svenska URL:erna, `src/data/categoryContent.ts`, `src/pages/categories/CategoryPage.tsx`, `src/lib/i18n.ts`, `src/pages/Products.tsx`, `src/routes/product.$handle.tsx` (loader), `public/robots.txt`, `scripts/generate-sitemap.ts`. Inga nya routes, inga URL-ändringar, inga designtokens rörs.
