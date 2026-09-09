# Recensionsmejl: gör webhooken kompatibel med de ämnen som faktiskt finns

Shopify-supporten har rätt: `orders/fulfilled` finns inte som valbart ämne i butikens webhook-lista, och ämnet "Orderdirigering för distributionsorder slutförd" (`fulfillment_orders/order_routing_complete`) skickar en helt annan payload än den funktionen läser idag. Därför får vi 0 schemalagda recensionsmejl.

Planen är att anpassa vår funktion till ett ämne som går att välja i listan — `fulfillments/create` ("Skapande av distribution") — istället för att tvinga fram `orders/fulfilled`.

## Vad som byggs

1. **Funktionen läser flera payload-format**
   `supabase/functions/shopify-fulfillment-webhook/index.ts` läser ämnet i `X-Shopify-Topic` och tolkar payloaden därefter:
   - `orders/fulfilled` — som idag (order-objekt).
   - `fulfillments/create` — fulfillment-objekt: order-id hämtas från `order_id`, e-post från `email` (annars slås ordern upp via Admin API när token fungerar), namn från `destination.first_name/last_name`, radposter från fulfillmentens `line_items`.
   - `fulfillment_orders/order_routing_complete` och övriga okända ämnen — svarar 200 och hoppar över, så inget dubbelschemaläggs.

2. **Ingen dubblettrisk**
   Schemaläggningen sker fortfarande mot `shopify_order_id` med `ignoreDuplicates`, så en order som både har `orders/fulfilled` och `fulfillments/create` bara ger ett mejl.

3. **Räknaren för STARTER199**
   Rabattkoder finns inte i en fulfillment-payload. Vi behåller räkningen som idag för order-payloaden och hoppar tyst över den för fulfillment-payloaden, så inget räknas fel.

4. **Test efter bygget**
   Signerad testpost mot funktionen med en `fulfillments/create`-payload, och kontroll att en rad läggs i `review_requests` med rätt e-post och radposter. Testraden tas bort efteråt.

## Vad du gör i Shopify (efter att detta är byggt och publicerat)

- Behåll URL:en `https://fpwwjbevjhxbggtkaabc.supabase.co/functions/v1/shopify-fulfillment-webhook`.
- Eftersom Shopify säger att adressen redan är tagen: öppna den befintliga webhooken med det felaktiga ämnet och byt ämne till **Skapande av distribution** (`fulfillments/create`), alternativt ta bort den och skapa en ny med det ämnet.
- Signeringshemligheten är redan uppdaterad och verifierad, så den behöver inte röras.

## Kvarstående blockering

Butikens sparade Admin-token svarar 401. Det påverkar bara två saker: e-postuppslag när fulfillment-payloaden saknar `email`, samt möjligheten att registrera `orders/fulfilled` via API. Vi bygger runt det, men om många fulfillments saknar e-post behöver Shopify-anslutningen förnyas.

## Publicering

Inget publiceras förrän du godkänner. Efter publicering kör vi en riktig testorder som fulfillas, och kontrollerar att recensionsmejlet går ut inom 5 dagar (eller tidigare via manuell körning).
