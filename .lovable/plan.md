# Plan: Recensionsmejl i produktion + riktiga boxsidor

## 1. Recensionsmejlen slutar ge 401 i produktion

Nyckelkontrollen i utskicksvägen är redan rättad i koden (den hämtar nyckeln ur databasens valv, precis som det schemalagda jobbet skickar den) — men rättelsen finns bara i förhandsvisningen. Den gäller på riktiga sajten först efter en publicering.

Steg:
1. Publicera sajten.
2. Lägg en testbeställning i utskickskön och anropa utskicksvägen på plaently.com med samma nyckel som kvartsjobbet använder — svaret ska bli 200 och "1 skickat", inte 401.
3. Kontrollera att rabattkoden skapats under rätt rabattregel ("PLÄNTLY Review", 10 %) och att leveransloggen visar mejlet till ahmet@plaently.com.
4. Ta bort testraden när det är bekräftat.
5. Kontrollera att inga rader ligger kvar som misslyckade; sätt i så fall tillbaka dem till schemalagda så de går ut i nästa kvartskörning.

## 2. Egna boxsidor med innehåll, ingredienser och råvaror

De fyra boxsidorna finns och fungerar, men de visar i dag ingen innehållslista och ingen ingrediens-/råvarutext — Shopify-beskrivningen för boxarna saknar det (till skillnad från smaksidorna).

Varje boxsida får tre nya delar, hämtade från motsvarande smak:

- **Det här ingår** — "12 koppar Fusilli Bolognese" (respektive Carbonara, Smoky BBQ Lentils, Yellow Curry & Rice), med portionsstorlek och tillagning på 5 minuter.
- **Ingredienser och råvaror** — den befintliga, manuellt granskade ingredienslistan för smaken, oförändrad i ordalydelse.
- **Näringsvärde per portion och allergener** — samma tabell och allergentext som smaksidan visar i dag.

Regler som följs:
- Ingrediens-, närings- och allergentext kopieras aldrig maskinöversatt. Svenska boxsidor använder svensk originaltext; engelska och tyska boxsidor använder den redan godkända engelska respektive tyska texten för smaken, annars svensk text som reserv.
- Inga påhittade värden. Om en uppgift saknas för en smak visas den inte.
- Pris, bild, köpknapp, recensioner och all övrig design lämnas orörd.

Kopplingen box → smak:

| Box | Smak |
|---|---|
| Bolognese Box | Fusilli Bolognese |
| Carbonara Box | Pasta Carbonara |
| Smoky Lentils Box | Smoky BBQ Lentils |
| Yellow Curry Box | Yellow Curry & Rice |

## 3. Kontroll av de fyra boxsidorna på plaently.com

Redan kontrollerat nu (alla svarar 200):

| Sida | Titel | Pris | Bild |
|---|---|---|---|
| Bolognese Box | Bolognese Box 12 koppar – 20g protein | 399 kr | Fusilli Bolognese |
| Carbonara Box | Carbonara Box 12 koppar – 20g protein | 399 kr | Pasta Carbonara |
| Smoky Lentils Box | Smoky Lentils Box 12 koppar – 21g protein | 399 kr | Smoky BBQ Lentils |
| Yellow Curry Box | Yellow Curry Box 12 koppar – 20g protein | 399 kr | Thai/Yellow Curry |

Efter att innehållet lagts till görs samma kontroll en gång till, plus att de nya avsnitten syns direkt i sidans HTML (viktigt för Google) och att sidorna ser rätt ut i mobilbredd.

## Tekniska detaljer

- Ingen ändring av utskickslogiken behövs; punkt 1 är publicering + verifiering av `/api/public/review-request-emails` mot vault-nyckeln, samt uppstädning av `review_requests`.
- Nytt datafilsbaserat innehåll: en mappning boxhandle → smakhandle, och återanvändning av befintlig granskad copy (`src/data/productCopyEn.ts`, `src/data/productCopyDe.ts`, Shopify-beskrivningen för smaken via `src/lib/productDescription.ts`).
- Rendering sker i `ProductDetail` (`src/pages/Products.tsx`) i samma sektion som dagens "Det här ingår"-kort, som i dag bara fylls när en publicerad bundle-rad matchar produkttiteln.
- Ingen ändring av rutter, priser, Shopify-katalogen, hreflang eller sitemap.
