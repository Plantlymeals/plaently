# Felsökning: 199 kr-erbjudandet ger "Något gick fel"

## Vad jag redan kunnat mäta

Serverloggarna sparas bara en timme bakåt och innehåller inget från ditt test, så det exakta Shopify-svaret finns inte kvar. Däremot testade jag butiken direkt nu:

| Nyckel | Skapa/läsa rabatter | Läsa produkter |
| --- | --- | --- |
| Nya `SHOPIFY_ADMIN_API_ACCESS_TOKEN` | 401 – "Invalid API key or access token" | 401 |
| `SHOPIFY_ACCESS_TOKEN` (gammal) | 401 | 401 |
| App-inloggning (client credentials) | 200 – fungerar | 403 – saknar produktbehörighet |

Slutsatsen: den token du la in senast är inte giltig för den här butiken (den avvisas direkt av Shopify, oavsett scopes). Appinloggningen fungerar däremot för rabatter, och det är den koden använder i första hand – därför är felet troligen inte "ingen behörighet alls", utan något i själva skapandet av rabatten. Mest sannolikt att produkt-ID:t `15554614133062` som rabatten låses till inte kan bekräftas (produktläsning ger 403), vilket ger 422 från Shopify vid skapandet.

Detta är ännu inte bevisat – nästa steg är att framkalla det riktiga felmeddelandet.

## Steg 1: få fram Shopifys faktiska svar

1. Logga hela felet i `src/lib/starterOffer.server.ts` och i `shopifyWithFallback` (`src/lib/shopifyDiscounts.server.ts`): status, Shopifys `errors`-objekt, vilken nyckel som användes och vilket steg (prisregel eller kod) som misslyckades.
2. Skicka tillbaka en kort felkod till webbläsaren (fortfarande utan känsliga detaljer) så att vi kan skilja "behörighet", "produkt" och "kod finns redan" åt.
3. Kör ett riktigt test mot butiken som skapar en tillfällig prisregel med samma inställningar som erbjudandet, läser av svaret och tar bort regeln igen. Då får vi det exakta felet inom minuter i stället för att vänta på en kund.

## Steg 2: åtgärda utifrån svaret

- **Om produkt-ID:t är fel eller inte kan användas:** lägg till produktläsning i appens behörigheter, eller lås rabatten till hela butiken/kollektionen i stället för ett hårdkodat produkt-ID.
- **Om det är behörigheter:** komplettera appen med `write_price_rules` och `write_discounts` och läs in nyckeln på nytt.
- **Om det är den ogiltiga nyckeln:** ta bort `SHOPIFY_ADMIN_API_ACCESS_TOKEN` och `SHOPIFY_ACCESS_TOKEN` helt så att koden inte slösar anrop på nycklar som alltid nekas. (Behöver du en fungerande sådan nyckel skapas den som en Custom app i butiken, inte i Dev Dashboard.)

## Rörs inte

Rabattens villkor (50 %, en per kund, en användning), rate limiting, adminpanelens rabattflöde, 410-regeln, robots.txt och språkvalet.
