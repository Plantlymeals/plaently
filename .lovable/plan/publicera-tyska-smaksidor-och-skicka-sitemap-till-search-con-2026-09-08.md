# Publicera tyska smaksidor och skicka sitemap till Search Console

## Mål
Publicera det aktuella bygget till `plaently.com` så att de fyra godkända tyska smaksidorna (`/de/product/...`) blir indexerbara och synliga i Google. Därefter skicka in den uppdaterade sitemapen i Google Search Console.

## Nuvarande läge (kontrollerat)
- `src/data/productCopyDe.ts`: alla fyra tyska smaker har `approved: true` (fusilli, carbonara, curry, lentils).
- `public/sitemap.xml`: innehåller 53 URL:er, inklusive alla 5 tyska produktsidor.
- `src/lib/searchConsole.ts`: appen har en funktion som skickar sitemap via `gsc-submit-sitemap`-edge-funktionen.

## Åtgärder
1. Kör `preview_ui--publish` för att publicera aktuellt bygge till `plaently.com`.
2. Vänta på att deploymenten är live och verifiera:
   - `https://plaently.com/` returnerar HTTP 200.
   - Tyska sidorna (`/de/product/plant-based-fusilli-bolognese` etc.) returnerar 200 med tysk text, inte `noindex`.
   - Sitemapen på `https://plaently.com/sitemap.xml` innehåller 53 URL:er och de 5 tyska `/de/product/...`-URLerna.
3. Skicka in sitemapen till Google Search Console. Detta kan göras på två sätt:
   - Via appens admin/CMS-funktion som anropar `submitSitemapToGoogle()` (om den är tillgänglig i admin-gränssnittet).
   - Manuellt i Search Console: gå till "Sitemaps" och skicka in `https://plaently.com/sitemap.xml`.
   - Ahmet behöver utföra inskickningen i Search Console om den inte sker automatiskt via appen.
4. Bekräfta att Search Console rapporterar sitemapen som "Success" eller åtminstone mottagen.

## Verifiering
- `https://plaently.com/de/product/plant-based-fusilli-bolognese` visar tysk ingrediens-/närings-/allergentext.
- Sitemapen innehåller 53 URL:er.
- Google Search Console har mottagit sitemapen.
