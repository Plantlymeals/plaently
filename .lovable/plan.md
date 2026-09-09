# Recensionsmejl: gör webhooken kompatibel med de ämnen som faktiskt finns

Shopify-supporten har rätt: `orders/fulfilled` finns inte som valbart ämne i butikens webhook-lista, och ämnet "Orderdirigering för distributionsorder slutförd" (`fulfillment_orders/order_routing_complete`) skickar en helt annan payload än den funktionen läser idag. Därför får vi 0 schemalagda recensionsmejl.

Planen är att anpassa vår funktion till ett ämne som går att välja i listan — `fulfillments/create` ("Skapande av distribution") — men först verifierar vi en riktig exempel-payload innan något byggs.

## Steg 0 — Verifiera riktig payload först (innan godkännande)

Det finns redan en sparad webhook-rad på vår URL (den med ämnet `fulfillment_orders/order_routing_complete`). Vi använder den som väg in:

1. **Du i Shopify-admin:** Inställningar → Aviseringar → Webhooks → öppna den befintliga raden på vår adress → byt ämne till **Skapande av distribution** (`fulfillments/create`) om det finns i listan → spara.
   - Om `fulfillments/create` inte finns i listan heller: säg till, då är API-vägen (kräver fungerande token) den enda möjligheten och planen omprövas.
2. **Du:** Klicka `⋯` på raden → **Skicka test**. Shopify skickar då ett riktigt exempelmeddelande för `fulfillments/create` till vår funktion.
3. **Jag:** Läser funktionens loggar och visar dig exakt vilka fält som kom in — särskilt om `email` eller någon kundadress finns med, och vad `order_id` heter.
   - Funktionen svarar i dag 200 och hoppar över okända ämnen, så testet skadar inget och schemalägger inga mejl.
4. Först när vi sett fältlistan tar vi beslutet: bygga enligt nedan, eller lägga ner den här vägen.

Ingen kod ändras och inget publiceras i steg 0.

## Vad som byggs (steg 1, efter att payloaden verifierats)

1. **Funktionen läser flera payload-format**
   `supabase/functions/shopify-fulfillment-webhook/index.ts` läser ämnet i `X-Shopify-Topic` och tolkar payloaden därefter:
   - `orders/fulfilled` — som idag (order-objekt).
   - `fulfillments/create` — fulfillment-objekt: order-id från `order_id`, e-post från `email` om det finns (annars slås ordern upp via Admin API när token fungerar), namn från `destination.first_name/last_name`, radposter från fulfillmentens `line_items`. Exakt fältmappning sätts utifrån den riktiga payloaden i steg 0.
   - `fulfillment_orders/order_routing_complete` och övriga okända ämnen — svarar 200 och hoppar över, så inget dubbelschemaläggs.

2. **Ingen dubblettrisk**
   Schemaläggningen sker fortfarande mot `shopify_order_id` med `ignoreDuplicates`, så en order som både har `orders/fulfilled` och `fulfillments/create` bara ger ett mejl.

3. **Räknaren för STARTER199**
   Rabattkoder finns inte i en fulfillment-payload. Vi behåller räkningen som idag för order-payloaden och hoppar tyst över den för fulfillment-payloaden. Känt och accepterat att räknaren inte löses av den här vägen.

4. **Test efter bygget**
   Signerad testpost mot funktionen med en `fulfillments/create`-payload, och kontroll att en rad läggs i `review_requests` med rätt e-post och radposter. Testraden tas bort efteråt.

## Kvarstående blockering

Butikens sparade Admin-token svarar 401. Det påverkar bara två saker: e-postuppslag när fulfillment-payloaden saknar `email`, samt möjligheten att registrera webhooks via API. Vi bygger runt det, men om den riktiga payloaden i steg 0 visar att `email` saknas behöver Shopify-anslutningen förnyas innan den här vägen fungerar i praktiken.

## Publicering

Inget publiceras förrän du godkänner efter steg 0. Efter publicering kör vi en riktig testorder som fulfillas, och kontrollerar att recensionsmejlet schemaläggs.
