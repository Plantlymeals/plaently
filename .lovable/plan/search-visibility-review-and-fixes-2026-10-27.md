# Search visibility review and fixes

## Where you stand today

- Google: the front page is indexed and crawled fine (last crawl 21 Oct). Last 28 days: 29 clicks and 728 impressions, a little up on the period before.
- Almost every click is people searching for "pläntly". Very few clicks come from people who don't already know the brand.
- Technical check: 8 of 9 checks pass. The one that fails (missing page language) is a false alarm. Every page sets its language correctly, so nothing changes there.
- Semrush (Swedish market): 23 keywords ranked, almost all far down the results (page 3 and lower).

## What you could realistically rank for


| Search (Sweden)                         | Semrush est./month | Now                            | Realistic target                 |
| --------------------------------------- | ------------------ | ------------------------------ | -------------------------------- |
| nyttig snabbmat                         | ~260               | position 15 (/nyttig-snabbmat) | page 1                           |
| carbonara protein / proteinpasta        | small              | position ~10                   | top 5                            |
| snabb nyttig lunch / snabb lunch recept | ~390 each          | position ~50 (blog)            | page 1–2 with a stronger article |
| nyttig lätt lunch                       | ~30                | position 27                    | page 1                           |
| proteinrika måltider, lunch på jobbet   | small              | not ranking yet                | page 1 (low competition)         |


Big generic searches like "lunch" or "protein" aren't realistic. Narrow searches about fast plant-based protein lunches are.

## Fixes to make

1. **/nyttig-snabbmat** (your best chance): fix the wrong "39 kr" price in the FAQ (it should be about 33 kr per meal), make the heading and intro clearly answer "nyttig snabbmat", and link to it from the front page and the products page.
2. **Blog "quick healthy lunch ideas"**: rewrite the Swedish post around "snabb nyttig lunch". Give it a clear answer near the top, a short list of ideas, and links to products. Don't make health claims, and don't use the word "vegan".
3. **Carbonara product page**: add "proteinpasta" and "carbonara med protein" wording to the title and description, keeping the existing structure.
4. **Old address `/#how-it-works**`: Google shows this address. It should simply point to the front page, so nothing needs to change unless it shows up as a separate result.
5. **AI search (ChatGPT, Perplexity, Google AI)**: check that AI crawlers are allowed. Add a short plain-language summary file (llms.txt) with what PLÄNTLY is, the prices and the main pages. Only facts already on the site.
6. Afterwards: run the SEO check (0 errors required), publish, resubmit the sitemap and ask you to request indexing for the changed pages.

&nbsp;

# Lovable-prompt: sök-synlighet — rättade fixar (27 okt)

## Bakgrund

Det här är en rättad version av ert eget förslag "Search visibility review and fixes". Innehållet och prioriteringen är i grunden bra och matchar vad vi redan vet från Search Console (se planens Del 11) — men tre saker i underlaget stämde inte mot den faktiska koden/datan när jag kontrollerade, och är rättade här innan ni börjar bygga.

**Rättelse 1 — exponeringssiffran.** Förslaget sa "728 exponeringar" för de senaste 28 dagarna. Jag hämtade Search Console live (samma period, domänegenskapen `sc-domain:plaently.com`, 28 sep–25 okt): **29 klick, 490 exponeringar**, inte 728. Klicksiffran stämmer, exponeringarna gör det inte — nästan 50 % avvikelse. Innan ni använder 728 som utgångsläge för att mäta effekten av fixarna: bekräfta exakt vilket datumintervall/filter ni räknade på. Använd annars 490 (Search Console, "Webb"-sökning, 28 dagar) som det verifierade nuläget.

**Rättelse 2 — `public/llms.txt` finns redan, det är en uppdatering, inte en ny fil.** Den befintliga filen har ett konkret, verifierat fel: den länkar till `/healthy-instant-meals`, en adress som redirectats bort sedan september (pekar nu på `/nyttig-snabbmat`, se planens Del 2 punkt 3) — en död länk i en fil vars hela syfte är att vara en korrekt sanningskälla för AI-crawlers. Den saknar också `/nyttig-snabbmat` helt (er just nu starkast rankade generiska sida) och innehåller inga priser. **Uppdatera den befintliga filen, skapa inte en ny.**

**Rättelse 3 — Semrush-positionerna och Search Console-positionerna mäter olika saker, blanda inte ihop dem i en före/efter-jämförelse.** Tabellens Semrush-position för "nyttig snabbmat" (15) matchar inte Search Console-datan jag hämtade för samma fras (position 26,4, 0 klick, samma 28-dagarsperiod). Troligen inte ett fel från er sida — Semrush rank-trackar med egna stickprov, Search Console mäter faktisk genomsnittsposition över alla riktiga exponeringar — men använd **en** källa konsekvent för att mäta om fixarna biter. Vi har redan följt Search Console i planen (Del 11), så fortsätt med den som facit, och använd Semrush bara för att hitta kandidat-sökord, inte för att mäta resultat.

**Robots.txt behöver ingen ändring.** Kontrollerat direkt: `public/robots.txt` tillåter redan alla user-agents brett `User-agent: * / Allow: /`), inga crawlers är blockerade. Punkt 5 i förslaget blir alltså bara "fixa llms.txt", inte "fixa robots.txt + llms.txt".

## Prompten till Lovable

**1. `/nyttig-snabbmat` (högst prioritet).** I `src/data/categoryContent.ts`, FAQ-posten "Är nyttig snabbmat dyrare än vanlig snabbmat?" (rad ~790) säger idag "En PLÄNTLY-kopp kostar 39 kr" — bekräftat fel på två sätt: (a) fel pris, (b) koppar säljs inte längre styckvis sedan september (se Del 2 punkt 5 i planen), bara i paket. Byt till det faktiska per-måltid-priset (~31–33 kr beroende på paket — Starter Pack 33 kr/måltid, Monthly Box 32 kr, Office Pack/Big Office Pack 31 kr) och formulera om meningen så den inte längre antyder styckköp. Se också till att rubrik och ingress på sidan tydligt besvarar frågan "nyttig snabbmat" högst upp. Länka till `/nyttig-snabbmat` från startsidan och produktsidan.

**2. Blogginlägget om snabb lunch.** Skriv om det svenska inlägget med fokus på "snabb nyttig lunch" — tydligt svar nära toppen, en kort lista med idéer, länkar till produkterna. Inga hälsopåståenden, undvik ordet "vegan" (etablerad regel i det här projektet, se tidigare produkttextarbete).

**3. Carbonara-produktsidan.** Lägg till "proteinpasta" och "carbonara med protein" i den **svenska** titeln/beskrivningen i `productSeo.ts`s `pasta-carbonara`-post — bekräftat att orden saknas idag. Rör inte strukturen i övrigt, och rör inte `endepl`-posterna.

**4. `/#how-it-works`.** Ingen kodändring — det är en ankarlänk på startsidan, inte en egen route. Lämna som det är om det inte dyker upp som ett eget separat resultat i Search Console.

**5. `public/llms.txt` — uppdatera den befintliga filen.** Byt ut länken till `/healthy-instant-meals` mot `/nyttig-snabbmat`. Lägg till riktiga priser (Starter Pack 399 kr/12 måltider, Monthly Box 759 kr/24, Office Pack 1490 kr/48, Big Office Pack 2890 kr/96 — hämta aktuella siffror från koden, inte från minnet, i fall de ändrats). Lägg bara till fakta som redan finns på sajten, ingen ny copy. `robots.txt` rör ni inte — redan korrekt.

**6. Efter byggena:** kör `check:seo` (0 fel krävs), typkontroll, visa mig diffen innan publicering. Efter publicering: skicka in sitemapen på nytt och be om indexeringsbegäran för de ändrade sidorna (samma rutin som tidigare i det här projektet).

## Vad som INTE rörs

URL:er, Shopify-handtag, engelska/tyska/polska sidorna, `html lang`-uppsättningen. Samma avgränsning som i det ursprungliga förslaget — bekräftat rimlig.

## Innan jag godkänner publicering

Jag läser `git diff` mot den faktiska koden (FAQ-prisraden, carbonara-titeln, llms.txt-länken) innan den går live — samma disciplin som alltid i det här projektet.

&nbsp;

## Technical details

- Edits limited to category content for /nyttig-snabbmat, the Swedish blog post (CMS row), productSeo.ts for carbonara (sv only), public/robots.txt and a new public/llms.txt.
- No changes to URLs, Shopify handles, en/de/pl pages or the html lang setup.
- Verify with check:seo, a typecheck and a live check after publishing.