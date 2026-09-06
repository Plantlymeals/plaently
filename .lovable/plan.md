# Steg 1 — hitta det faktiska Shopify-felet för 199 kr-erbjudandet

Målet med den här omgången är enbart diagnos: få fram det riktiga felmeddelandet från Shopify när en kod ska skapas. Ingen ändring av erbjudandets villkor, priser eller rabattens omfattning.

## Svar på dina två villkor

1. **Rabatten låses aldrig till hela butiken.** Koden skapas redan låst till enbart Starter Pack (produkt-ID 15554614133062) tillsammans med gränsen på en användning per kund. Det ändras inte i den här omgången, och om produktkopplingen visar sig vara felkällan är förslaget att ge appen läsbehörighet till produkter — inte att bredda rabatten.

2. **Nycklarna:** en genomgång av all kod visar att `SHOPIFY_ADMIN_API_ACCESS_TOKEN` bara används av rabattflödet (både popup-erbjudandet och adminpanelen går genom samma kod). Men `SHOPIFY_ACCESS_TOKEN` används också av den automatiska "lämna en recension"-utskicket, som skapar en rabattkod åt kunden. Den nyckeln får alltså inte tas bort utan att recensionsutskicket först flyttas över till samma app-inloggning. Ingen av nycklarna tas bort i den här omgången.

## Vad som görs nu

1. Lägg till tydlig loggning i erbjudande-flödet på servern: vilket inloggningssätt som användes, vilket steg som misslyckades (regel eller kod), Shopifys statuskod och feltext — endast i serverloggen, aldrig till besökaren.
2. Besökaren fortsätter få ett kategoriserat meddelande (behörighet / produkt / koden finns redan / okänt fel), utan Shopifys råa text.
3. Kör ett tillfälligt skarpt test som skapar en rabattregel och en kod, läser tillbaka dem och tar bort båda direkt efteråt. Inget testdata lämnas kvar i Shopify eller i databasen.
4. Redovisa det faktiska felet (eller att det faktiskt fungerar) innan någon fix byggs i Steg 2.

## Tekniska detaljer

- Filer som berörs: `src/lib/starterOffer.server.ts` och `src/lib/shopifyDiscounts.server.ts` (endast loggning och felkategorisering).
- Oförändrat: rabattens 50 %, `target_selection: 'entitled'` med `entitled_product_ids: [15554614133062]`, `allocation_limit: 1`, en användning per kund, taket på 500 koder, IP-gränser, RLS och adminpanelens `runDiscountAction`/behörighetskontroll.
- Testet körs mot produktionens Shopify-butik och städas upp i samma körning.
