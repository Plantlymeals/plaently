# Felsökning: 199 kr-erbjudandet ger "Något gick fel"

## Vad som redan är uteslutet (mätt nu mot butiken)

- Produkten är rätt: ID 15554614133062 = "Starter Pack — 12 Cups", handtag `starter-pack-12-cups-1`, aktiv.
- Den nya Admin-nyckeln och den gamla nyckeln ger båda 401 "Invalid API key or access token" — de fungerar inte för den här butiken.
- App-inloggningen (client credentials), som koden provar först, fungerar: rabatt-API:t svarar 200.

Felet ligger alltså troligen i själva skapandet av rabatten, inte i produktuppslaget eller i avsaknad av behörighet överlag. Det är ännu inte bevisat.

## Steg 1: framkalla det exakta felet

Kör ett skarpt test mot butiken som skapar en tillfällig prisregel med exakt samma inställningar som erbjudandet (50 %, en användning, en per kund, låst till Starter Pack), läser av Shopifys hela svar och tar bort regeln igen direkt. Inget rörs i databasen och ingen kund påverkas.

## Steg 2: förbättra felrapporteringen

I `src/lib/starterOffer.server.ts` och `src/lib/shopifyDiscounts.server.ts`: logga status, Shopifys felobjekt och vilket steg som misslyckades (prisregel eller kod), samt vilken nyckel som användes. Då syns orsaken direkt i loggarna nästa gång i stället för bara "något gick fel".

## Steg 3: åtgärda utifrån svaret

- Om skapandet nekas på behörighet: komplettera appen med rätt rabattbehörigheter.
- Om det är produktkopplingen: lås rabatten till hela butiken eller en kollektion i stället för ett enskilt produkt-ID.
- Oavsett utfall: ta bort de två nycklar som alltid ger 401, så att inga anrop slösas på dem och felmeddelandet inte blir missvisande.

## Rörs inte

Rabattens villkor (50 %, en per kund, en användning), rate limiting, adminpanelens rabattflöde, 410-regeln, robots.txt och språkvalet.
