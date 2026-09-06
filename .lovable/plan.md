# 199 kr-erbjudandet: samma app-inloggning överallt

Shopifys svar bekräftar bilden: appinstallationen har redan rätt behörigheter (bland annat produktläsning och rabatter). Problemet ligger alltså i vilken inloggning koden faktiskt använder, inte i vad appen får göra. Ingen ny hemlighet skapas.

## Vad koden gör i dag

- Rabattflödet provar flera inloggningar i tur och ordning: först app-inloggningen (den som fungerar), därefter de manuellt inlagda nycklarna som svarar 401.
- Erbjudandet slår inte längre upp produkten i Shopify – produkt-ID:t är hårdkodat – så 403:an vi sett kom bara från vårt eget testanrop, inte från kundflödet.
- Den automatiska "lämna en recension"-funktionen använder fortfarande en av de manuella nycklarna och måste flyttas över till samma app-inloggning innan de nycklarna tas bort.

## Steg 1 – bevisa rotorsaken (denna omgång)

1. Logga i serverloggen exakt vilken inloggning som används och vilket steg som misslyckas (rabattregel eller kod), med Shopifys statuskod och feltext. Inget av detta visas för besökaren.
2. Besökaren får fortsatt bara en kategori: behörighet, produkt, koden finns redan, eller okänt fel.
3. Kör ett skarpt test som skapar en rabattregel + kod på riktigt, läser tillbaka dem och tar bort båda direkt. Inget testdata lämnas kvar i Shopify eller i databasen.
4. Redovisa det faktiska felmeddelandet (eller att det numera fungerar) innan något byggs om.

## Steg 2 – först efter din bekräftelse

- Låt rabattflödet använda enbart app-inloggningen, så de ogiltiga manuella nycklarna aldrig kan störa.
- Flytta recensionsutskicket till samma app-inloggning.
- Först därefter går det att städa bort de två ogiltiga nycklarna.

## Oförändrat

Rabatten är låst till enbart Starter Pack (produkt-ID 15554614133062), 50 %, en användning per kund, en artikel per order, taket på 500 koder, IP-gränserna, databasens skyddsregler och adminpanelens behörighetskontroll. Rabatten breddas aldrig till hela butiken eller en bred kollektion.

## Filer som berörs i steg 1

`src/lib/starterOffer.server.ts` och `src/lib/shopifyDiscounts.server.ts` – endast loggning och felkategorisering.
