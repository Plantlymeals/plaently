# SEO-innehåll på tre kategorisidor

Bygger om det synliga innehållet på /high-protein-meals (/proteinrika-maltider), /nyttig-snabbmat (/healthy-fast-food) och /plant-based-meals (/plantbaserade-maltider) enligt mönstret: kort svar överst, jämförelsetabell, FAQ med riktiga sökfrågor, intern länkning.

Title, meta, canonical och hreflang rörs inte alls.

## Vad som läggs till per sida

**1. Kort svar-block** direkt under hero/ingress: 2–4 meningar i vanligt språk som svarar på vad sidan handlar om. Visas som ett tydligt markerat kort ("Kort svar" / "Short answer") så det går att citera i sökresultat och AI-svar.

**2. Jämförelsetabell** på /high-protein-meals och /plant-based-meals: PLÄNTLY jämfört med proteinpulver/shake, äta ute och laga från grunden. Kolumner: Tid att tillaga, Protein per portion, Ungefärligt pris, Kylskåpskrav. Ärliga värden — t.ex. att proteinpulver är snabbare och ofta billigare per gram protein, men inte är en måltid; att hemlagat är billigast men tar tid. Tabellen är horisontellt scrollbar på mobil.

/nyttig-snabbmat får ingen tabell (enligt "där det är relevant"), utan istället ett kort jämförande stycke i FAQ-svaren.

**3. FAQ-sektion i slutet** med exakt de angivna frågorna som H3, svar på 2–4 meningar i sajtens raka, transparenta ton. Sidan har redan en FAQ-sektion — den ersätts med dessa frågor (befintliga relevanta svar återanvänds där de passar).

- /high-protein-meals: Vad räknas som en proteinrik måltid? / Hur mycket protein behöver jag äta per dag? / Är färdiga proteinmåltider nyttiga? / Kan man äta proteinrik mat varje dag?
- /nyttig-snabbmat: Är nyttig snabbmat dyrare än vanlig snabbmat? / Vad är skillnaden mellan nyttig snabbmat och vanlig färdigmat? / Håller sig instant-måltider länge? / Är torrvaror med tillsatt vatten nyttigt?
- /plant-based-meals: Vad är en växtbaserad måltid? / Är växtbaserat protein lika bra som animaliskt? / Passar växtbaserade måltider för viktnedgång? / Vilka näringsämnen bör veganer vara extra uppmärksamma på?

Engelska motsvarigheter skrivs för EN-versionen av varje sida (sidorna renderas på båda språken).

**4. Intern länkning**: kontextuella textlänkar i brödtext och kort-svar-blocket till /products ("Se våra proteinkoppar"), till /nutrition där näringsvärden nämns, och mellan de tre sidorna där det är naturligt. Befintlig "Utforska mer"-modul behålls.

## Vegan vs vegetarisk — hård regel

Fusilli Bolognese och Smoky BBQ Lentils = veganska. Pasta Carbonara och Yellow Curry & Rice = vegetariska (mjölkprotein). I allt nytt innehåll, särskilt på /plant-based-meals, skrivs detta ut explicit: sortimentet är växtbaserat, två smaker är veganska och två är vegetariska. Inga formuleringar som "100% växtbaserat" eller "veganskt" om hela sortimentet.

## Tekniskt

- `src/data/categoryContent.ts` utökas med fält: `quickAnswer` (sträng), `comparison` (valfri: kolumnrubriker + rader), och `bodyLinks` för inline-länkar. FAQ-arrayen uppdateras för de tre nycklarna på både `sv` och `en`.
- `src/pages/categories/CategoryPage.tsx` renderar det nya kort-svar-blocket, den valfria tabellen och FAQ:n med H3-rubriker (idag `<summary>` utan rubriktagg). Befintlig sektionsordning bevaras i övrigt.
- FAQ-svaren återanvänds som FAQPage JSON-LD på dessa sidor så innehållet matchar strukturerad data.
- Övriga två kategorisidor (/protein-cups, /healthy-instant-meals) lämnas oförändrade; nya fält är valfria.
