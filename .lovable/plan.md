# Live checkout-test: verifiera Shopify shipping zones

## Mål
Bevisa att Shopify-kassan returnerar samma fraktpriser och fri-frakt-trösklar som `src/lib/markets.ts` påstår, för Sverige, EU och UK.

## Förväntade värden (från `src/lib/markets.ts`)

| Marknad | Standardfrakt | Fri frakt över |
|---------|---------------|----------------|
| SE 🇸🇪  | 49 SEK        | 399 SEK        |
| EU 🇪🇺  | 69 SEK        | 599 SEK        |
| UK 🇬🇧  | 79 SEK        | 699 SEK        |

## Testmatris (6 scenarion)

För varje marknad körs två tester — ett **under** tröskeln (ska visa standardfrakt) och ett **över** tröskeln (ska visa fri frakt / 0 kr).

| # | Marknad | Adress           | Varukorg              | Förväntat fraktpris |
|---|---------|------------------|-----------------------|---------------------|
| 1 | SE      | Stockholm        | 1× Box of 12 (~199)   | 49 SEK              |
| 2 | SE      | Stockholm        | 1× Bundle 48 (~799)   | 0 SEK (fri)         |
| 3 | EU      | Berlin, DE       | 1× Box of 12          | 69 SEK              |
| 4 | EU      | Berlin, DE       | 1× Bundle 48          | 0 SEK (fri)         |
| 5 | UK      | London, GB       | 1× Box of 12          | 79 SEK              |
| 6 | UK      | London, GB       | 2× Bundle 48 (>699)   | 0 SEK (fri)         |

## Metod (teknisk)

1. **Playwright-skript** under `/tmp/browser/shipping-zones/` som:
   - Öppnar `http://localhost:8080`, lägger till rätt produkt i kassan via UI (klick på "Lägg till" / bundle-knappar).
   - Klickar "Checkout" → öppnar Shopify-checkout i ny tab.
   - Fyller i shipping-adress (test-e-post, fejk namn/telefon, riktig postkod per land).
   - Läser av fraktraden som Shopify visar i kassan ("Shipping" / "Frakt").
   - Tar screenshot per scenario som bevis.
2. **Resultatmatris** sammanställs i chatten — match/mismatch per scenario, med screenshot-referenser.
3. Vid mismatch: jag pekar exakt vilken zon i Shopify Admin (Settings → Shipping & delivery) som behöver justeras, samt vilket pris/tröskel.

## Viktigt att veta innan vi kör

- **Inga riktiga ordrar läggs** — vi stannar på shipping-steget och stänger fliken innan betalning.
- Testet använder fejk-mejl (`test+se@plaently.com` etc.) så Shopify inte tror det är riktiga kunder.
- Testet kör mot **live Shopify-checkouten** (samma som riktiga kunder ser) — det är enda sättet att verifiera zonerna utan Admin API-åtkomst.
- Tar ~5–10 min att köra alla 6 scenarier.

## Vad jag levererar tillbaka

- En tabell: scenario → förväntat vs. faktiskt fraktpris → ✅/❌
- Screenshots per scenario
- Konkret åtgärdslista för Shopify Admin om något inte matchar
