# Del 3/4-städning: Steg 1, 2 och 5

Bygger endast Steg 1 + Steg 2 (+ Steg 5 om det visar sig finnas något att koppla). Steg 3, 4 och 6 rörs inte.

## Steg 1 — /halsosamma-snabbmaltider → /nyttig-snabbmat (301)

Hittade referenser till den gamla adressen (alla pekas om):

- `src/server.ts` — ny rad i den permanenta redirect-listan: `/halsosamma-snabbmaltider` → `/nyttig-snabbmat`. Dessutom måste den befintliga raden `/healthy-instant-meals` → `/halsosamma-snabbmaltider` pekas om direkt till `/nyttig-snabbmat`, annars uppstår en redirect-kedja i två hopp.
- `src/routes/halsosamma-snabbmaltider.tsx` — sidan tas bort (adressen serveras nu av redirecten).
- `scripts/generate-sitemap.ts` och `public/sitemap.xml` — raden tas bort; sitemap regenereras.
- `src/components/Footer.tsx` (tre länkar, sv + en), `src/data/internalLinks.ts` (sv + en), `src/data/categoryContent.ts` (slug-mappning och två slug-fält) — pekas om till `/nyttig-snabbmat`.

Innehållet på `/nyttig-snabbmat` ändras inte.

## Steg 2 — död kod och gamla språkrester

- `src/routes/__root.tsx`: `inLanguage` blir bara `["sv-SE"]`.
- `src/pages/admin/AdminBlog.tsx`: de tre ställena som defaultar nya inlägg till engelska byts till svenska (rad 39, 54, 93; kategorietiketten på rad 107 följer med).
- `src/pages/PrivacyPolicy.tsx`: självreferensen till den döda adressen `/privacy-policy` byts till `/integritetspolicy`.
- Döda `isEn`-grenar tas bort i `PrivacyPolicy.tsx` (där `isEn` är hårdkodat `false`), `Terms.tsx` och `Shipping.tsx` (där `routeLang` alltid är `"sv"`). `routeLang`-strukturen och de engelska textblocken i `categoryContent.ts` lämnas orörda.
- Hreflang: sökning visar inga kvarvarande hreflang-taggar i koden — bekräftas i svaret, ingen ändring.

## Steg 5 — "Begränsat erbjudande"-badgen

Badgen på startsidans Starter Pack-block är redan kopplad till den riktiga räknaren ("X av 500 kvar") och faller bara tillbaka på texten när räknaren saknas. Ingen separat statisk badge hittades på produktsidorna. Vi gör en sista genomsökning vid bygget; finns ingen statisk badge blir Steg 5 en bekräftelse utan kodändring.

## Verifiering

- Bygg/typcheck.
- Kontrollera lokalt att `/halsosamma-snabbmaltider` och `/healthy-instant-meals` båda ger 301 direkt till `/nyttig-snabbmat` (ett hopp), och att `/nyttig-snabbmat` ger 200.
- Kontrollera att sitemap inte längre innehåller den gamla adressen.
- Sammanfattning med alla omdirigerade interna länkar innan publicering.
