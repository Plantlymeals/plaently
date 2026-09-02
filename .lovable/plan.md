# Fix nyckelordskannibalisering på "proteinmåltider"

Idag finns redan en svensk sida på `/proteinrika-maltider` som är hreflang-parad med `/high-protein-meals`. Att lägga till `/proteinmaltider` vid sidan av den skulle skapa ny intern kannibalisering mellan två nästan identiska svenska sidor. Planen flyttar därför den svenska sidan till `/proteinmaltider`, skriver om innehållet mot "proteinmåltider" och 301-redirectar den gamla URL:en.

## 1. Ny svensk landningssida `/proteinmaltider`

- Ny route `src/routes/proteinmaltider.tsx` som renderar samma kategorisida med svensk lokalisering.
- Innehållet skrivs om till egen svensk text (inte översättning): H1 "Proteinmåltider – 20 g protein på 5 minuter", omskriven ingress, "Kort svar"-block, jämförelsetabell och avsnittsrubriker där "proteinmåltider" och närliggande varianter (proteinrik lunch, färdiga proteinmåltider) används naturligt.
- Egen svensk `<title>` och meta description med "proteinmåltider" som primärt sökord.
- FAQ på sidan behålls/anpassas till svenska sökfrågor och speglas i FAQPage-schemat.
- Compliance behålls: Bolognese + Smoky BBQ = veganska, Carbonara + Yellow Curry = vegetariska. Ingen "100 % veganskt".

## 2. `/high-protein-meals` orörd

Engelska sidan behåller sin struktur, sin egen title/meta och sitt innehåll.

## 3. Canonical och språk

- `/proteinmaltider`: `html lang="sv"`, self-referencing canonical mot `https://plaently.com/proteinmaltider`.
- `/high-protein-meals`: self-referencing canonical mot sig själv, `lang="en"`.

## 4. Hreflang-par

Båda sidorna får:
- `hreflang="sv"` → `https://plaently.com/proteinmaltider`
- `hreflang="en"` → `https://plaently.com/high-protein-meals`
- `hreflang="x-default"` → svenska versionen

## 5. Gamla URL:en

`/proteinrika-maltider` ger en server-side 301 till `/proteinmaltider` så länkkraft och indexering flyttas över. Sitemap uppdateras: gamla URL:en tas bort, nya läggs till.

## 6. Om oss-sidan

- Title och meta description skrivs om till varumärkes-/story-fokus (Stockholm, grundarhistoria, riktiga råvaror) utan "proteinmåltider" som sökordsmål. Nuvarande title "Om PLÄNTLY | Växtbaserade Proteinmåltider från Stockholm" ersätts.
- En kontextuell länk läggs in i brödtexten med ankartexten "våra proteinmåltider" som pekar på `/proteinmaltider`.

## Tekniskt

- `src/data/categoryContent.ts`: `svSlugByKey["high-protein-meals"]` blir `proteinmaltider`, svenska texterna för nyckeln skrivs om.
- `src/lib/localeAlternates.ts`: paret uppdateras till `["/proteinmaltider", "/high-protein-meals"]`.
- `src/lib/legacyRedirects.ts` + route för `/proteinrika-maltider` ger 301 (server-side, inte JS-redirect).
- `src/lib/i18n.ts`: nya `seo.about.*`-strängar och en ny nyckel för länktexten i `src/pages/About.tsx`.
- `src/data/internalLinks.ts` och `scripts/generate-sitemap.ts` pekas om till nya sluggen; `public/sitemap.xml` regenereras.
- Verifiering: curl mot lokal SSR för `<title>`, canonical, hreflang och 301-statuskod.
