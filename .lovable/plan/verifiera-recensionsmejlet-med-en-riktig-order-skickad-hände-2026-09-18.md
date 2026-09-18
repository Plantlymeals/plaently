# Verifiera recensionsmejlet med en riktig "order skickad"-händelse

## Bakgrund

Flödet testades senast igenom hela kedjan och mejlet levererades till ahmet@plaently.com med en giltig rabattkod. Sedan dess har vi bytt mejlväg till Lovables egna utskick, och den vägen är aktiv först efter publicering. Ett nytt test är därför meningsfullt — men det bör köras mot den publicerade sajten för att bevisa att den riktiga vägen fungerar, inte bara förhandsvisningen.

## Vad jag gör

1. Publicerar de väntande ändringarna (butiksnyckeln och mejlmallarna) så att den automatiska mejlvägen är live.
2. Skickar en äkta, korrekt signerad "order skickad"-händelse till vår webhookadress, med din e-postadress som kund och en riktig produkt i ordern.
3. Kontrollerar att webhooken svarar OK och att ett recensionsmejl schemaläggs.
4. Kör utskicket direkt (utan att vänta 5 dagar) och kontrollerar:
   - att rabattkoden skapas i butiken mot rätt rabattregel (10 % "PLÄNTLY Review"),
   - att koden verkligen går att lösa in,
   - att mejlet registreras som levererat.
5. Ber dig bekräfta att mejlet ligger i inkorgen, och visar vilken kod det innehåller.
6. Rensar bort testordern och testposten efteråt, så inget skräp ligger kvar.

## Om något går fel

Jag rapporterar exakt var kedjan bröts (webhook, rabattkod eller leverans), föreslår fix och kör om testet efter ditt godkännande.

## Tekniska detaljer

- Webhook: `orders/fulfilled` → `shopify-fulfillment-webhook`, HMAC-signerad med appens client secret.
- Utskick: `/api/public/review-request-emails` (mallen `review-request`), triggad manuellt med intern hemlighet.
- Rabattregel-ID: `1905603477830` (reservvägen, eftersom det sparade värdet inte är ett giltigt ID).
- Testdata i `review_requests` och testordern raderas efter verifiering.
