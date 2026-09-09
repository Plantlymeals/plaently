# Webhook orders/fulfilled — vad som går och inte går

## Kort svar på begäran

Jag kan **inte** skapa webhook-prenumerationen `orders/fulfilled` från Lovable just nu. Det är verifierat, inte antaget:

- Shopify-kopplingen i Lovable ger bara produkt-, pris- och rabattverktyg. Det finns inget verktyg för webhook-prenumerationer alls.
- De två butiksnycklar som är sparade i projektet (`SHOPIFY_ADMIN_API_ACCESS_TOKEN` och `SHOPIFY_ACCESS_TOKEN`) svarar båda **HTTP 401 – "Invalid API key or access token"** mot butikens admin-API i dag. Testat mot `plantly-website-cms-fyvdr.myshopify.com`.

Så länge nyckeln är ogiltig kan varken jag eller någon kod i projektet registrera, läsa eller ändra webhooks. Det är grundorsaken — inte ämnesvalet.

## Vad som redan är på plats

- Mottagaradressen lever och är skyddad: osignerade anrop avvisas, korrekt signerade svarar 200.
- Signeringsnyckeln i projektet matchar den som visas i Shopify.
- Uppföljningsjobbet (var 15:e minut) svarar 200 och plockar upp jobb när de finns.

Det enda som saknas är att en riktig `orders/fulfilled`-händelse faktiskt skickas till adressen.

## Två vägar framåt — välj en

### Väg A (rekommenderad): ny giltig admin-nyckel, sedan registrerar jag webhooken
1. Du skapar en ny privat app / admin-nyckel i Shopify-adminen med rättigheterna `read_orders` och `write_orders` (behövs för webhook-registrering) samt `read_fulfillments`.
2. Du sparar nyckeln i projektet via den säkra formulärflödet (jag ber om den när du säger till).
3. Jag verifierar nyckeln, listar befintliga webhooks, tar bort/ändrar den felaktiga raden på samma adress (`fulfillment_orders/order_routing_complete`) och registrerar `orders/fulfilled` mot exakt samma URL.
4. Jag bekräftar för dig: ämne, URL, format och att skapandet gick utan fel — med Shopifys eget svar som bevis.
5. Därefter kör vi ett riktigt end-to-end-test på en fulfillad testorder.

### Väg B: du registrerar den själv i Shopify-adminen
Adressen är upptagen av den befintliga raden, så ordningen spelar roll:
1. Inställningar → Aviseringar → Webhooks.
2. Öppna raden "Orderdirigering för distributionsorder slutförd" på Supabase-adressen och **ta bort den**.
3. Skapa ny webhook: ämne **Order fulfilled / orders/fulfilled**, format **JSON**, URL:
   `https://fpwwjbevjhxbggtkaabc.supabase.co/functions/v1/shopify-fulfillment-webhook`
4. Kör "Skicka test" på den nya raden och säg till — jag läser loggen och bekräftar att den togs emot och tolkades rätt.

Om `orders/fulfilled` inte går att välja i listan i din admin behöver den skapas via API, vilket åter kräver Väg A.

## Vad jag inte gör i det här steget

- Ingen kodändring, ingen publicering.
- Byter inte till `fulfillments/create` eller `fulfillment_orders/order_routing_complete`.
- STARTER199-räknaren berörs inte av detta (känt och accepterat).

## Teknisk detalj

Webhook-registrering sker mot `POST /admin/api/2025-07/webhooks.json` med `{"webhook": {"topic": "orders/fulfilled", "address": "<supabase-url>", "format": "json"}}`. Kräver en admin-nyckel med skrivrättighet på orders; storefront-nyckeln duger inte. Mottagarfunktionen `shopify-fulfillment-webhook` verifierar redan HMAC mot `SHOPIFY_WEBHOOK_SECRET` och förväntar sig ett order-objekt med order-id och kund-e-post, vilket `orders/fulfilled` levererar.
