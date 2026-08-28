# Skicka in sitemap i Google Search Console + omindexering av produktsidor

## Mål
Få Google att plocka upp de nya kanoniska produkt-URL:erna efter duplicate-content-fixen (301-redirects, kanoniska handles i sitemap).

## Viktigt om ordning
Canonical/redirect-fixen är ännu **inte publicerad** — den finns bara lokalt i preview. Google får inte se en sitemap som pekar på nya handles förrän koden är live, annars skickar vi in en sitemap som inte matchar produktionen. Därför måste vi publicera först.

## Steg

1. **Publicera** den aktuella koden (canonical-fix, 301-redirects, uppdaterad sitemap-generator) så att `https://plaently.com/sitemap.xml` live listar de nya handlen (t.ex. `monthly-box-24-cups`, `office-pack-48-cups`, `big-office-pack-96-cups`).
2. **Verifiera live** att `https://plaently.com/sitemap.xml` serverar de kanoniska URL:erna och att gamla handles svarar 301.
3. **Skicka in sitemapen** i Google Search Console via `PUT /webmasters/v3/sites/{siteUrl}/sitemaps/https%3A%2F%2Fplaently.com%2Fsitemap.xml` för den verifierade egenskapen som täcker `https://plaently.com/` (egenskapen väljs från `GET /webmasters/v3/sites` i samma körning).
4. **Läsa indexstatus** för de 6 berörda produktsidorna (3 gamla + 3 nya handles) med URL Inspection API (`index:inspect`).

## Begränsning — omindexering kan inte begäras via API
URL Inspection API:et kan **bara läsa** indexstatus — det finns ingen API-metod för att begära omindexering eller re-crawl. Det är enbart möjligt manuellt i Search Console (URL Inspection → "Begär indexering") av någon med direkt åtkomst till egenskapen. Alternativen vi kan göra automatiskt:

- Sitemap-inlämning (steg 3) — detta är Googles rekommenderade sätt att signalera ändrade URL:er och triggar ny crawl.
- Den befintliga `gsc-submit-sitemap`-funktionen i admin kan användas för framtida omskickningar.

## Tekniska detaljer
- Egenskapen löses via `GET /webmasters/v3/sites`, filtrerat på verifierade poster som täcker `https://plaently.com/` (URL-prefix eller `sc-domain:`). Vid flera träffar frågar jag dig innan inlämning.
- Inga kodändringar behövs — `public/sitemap.xml` är redan korrekt genererad och sitemap-routen serverar den.

## Verifiering
- Live-check av sitemap-XML och 301-redirects efter publicering.
- Rapport av Search Console-svaret (inskickad/behandlad) och indexstatus per produktsida.
