# SEO-optimering av PLÄNTLY (utan designändringar)

Ingen ändring av design, SSR, checkout/Shopify, analytics, boxarnas unika beskrivningar eller title/meta på /high-protein-meals, /nyttig-snabbmat och /plant-based-meals.

## 1. Metadata som uppdateras

- `/` (startsidan): title "PLÄNTLY | Hälsosam snabbmat med 20g protein" + ny meta description, satt i route-`head()` (samma mekanism som idag, inget nytt system).
- `/products`: title "Proteinmåltider | 20g protein på 5 min | PLÄNTLY" + ny meta description. H1 "Våra proteinmåltider" behålls.
- `/proteinkoppar`: title "Proteinkoppar | 20g protein på 5 min | PLÄNTLY" + ny meta description. Engelska `/protein-cups` lämnas orörd så hreflang-paret behålls.
- Orört: title/meta på /high-protein-meals, /nyttig-snabbmat, /plant-based-meals (bekräftas i slutrapporten).

## 2. Textfixar

- "Protein måltider" → "Proteinmåltider" och "Välj bland våra, protein och fiberrika smaker." → "Välj bland våra protein- och fiberrika smaker." (svenska i18n-nycklarna).

## 3. Jämförelsetabellerna (lättare version)

På /high-protein-meals + /proteinrika-maltider och /plant-based-meals + /plantbaserade-maltider:

- Priskolumnen tas bort helt (både kolumn, celler och prisnoten under tabellen).
- Kvar: alternativ, tid att tillaga, protein per portion, kylskåpskrav.
- Rubriker, "Kort svar"-block, FAQ och intern länkning lämnas orörda.

## 4. Miljöpåståenden på plantbaserade sidor

- "Upp till 90% lägre CO2 vs nötkött" / motsvarande engelska formuleringar skrivs om till ett styrkbart påstående med källhänvisning (Poore & Nemecek, Science 2018) eller tonas ned till "betydligt lägre klimatavtryck" om exakt siffra inte kan styrkas per produkt.
- Compliance behålls: Bolognese + Smoky BBQ Lentils = veganska; Carbonara + Yellow Curry = vegetariska. Befintlig FAQ-formulering rörs inte.

## 5. Query-parameter-URL:er (GSC-exponeringar)

- `public/robots.txt` kompletteras: `Allow: /` samt `Disallow: /*?q=`, `/*?s=`, `/*?search=`, `/*?page=`, `/*?utm_`, `/admin`, `/mcp` — befintliga rader bevaras.
- Säkerställ self-referencing canonical utan query-parametrar på /products och kategorisidor, så parametervarianter konsolideras.

## 6. Verifiering (rapporteras, ändras bara vid fel)

- Hreflang-paren i listan: self-referencing canonical + korrekt hreflang + sv som x-default. Inga dubbletter av hreflang-taggar.
- Produkt-crawlbarhet efter SSR-migreringen: namn, H1, beskrivning, pris, lagerstatus, bild-ALT, näringsinfo i server-HTML för enskilda smaker, boxar och paket.
- JSON-LD: Organization/WebSite (root), Product+Offer (produkt), BreadcrumbList, Article (blogg), FAQPage endast där synlig FAQ finns — ingen dubblering, schema matchar synligt innehåll.
- Open Graph per viktig sida: og:title, og:description, og:image, og:url, og:type (befintliga produktbilder).
- Sitemap: alla indexerbara lokaliserade URL:er, inga admin/utility-sidor, inga parameter-URL:er.
- Intern länkning: Start → Produkter → Hälsosam snabbmat → Proteinrika → Plantbaserade → Proteinkoppar → produkter → blogg, med naturlig ankartext.
- Trasiga interna länkar, orphan pages, statuskoder och redirects kontrolleras med en crawl mot lokal SSR.

## 7. Slutrapport

Kort rapport med: ändringar, det som redan var korrekt, metadataändringar (inkl. bekräftelse att de tre undantagna sidorna inte rördes), schemaändringar, canonical/hreflang/sitemap/robots-status, produkt-crawlbarhet och kvarvarande punkter som kräver manuell åtgärd.

## Teknisk detalj

- Metadata sätts i befintliga mekanismer (route `head()` / `categoryContent.ts` / `SEOHead`) — inga nya metadata-system, inga nya routes, inga URL-ändringar.
- Tabelländringen sker i `src/data/categoryContent.ts` (data) och, om nödvändigt, i renderingen i `src/pages/categories/CategoryPage.tsx` utan stilomskrivning.
- Verifiering via Playwright mot lokal server (SSR-HTML) plus JSON-LD-extraktion.
