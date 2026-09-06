# Fast rabattkod STARTER199 istället för unika koder

Erbjudandet slutar helt att prata med Shopify när någon fyller i sin e-post. Alla som anmäler sig får samma kod, `STARTER199`, som du redan skapat i Shopify. Därmed blir hela token-/behörighetsproblemet irrelevant för det här flödet, och diagnosen avbryts.

## Vad som tas bort

- Skapandet av rabattregel och kod i Shopify vid varje inlösen.
- IP-gränsen för kodutfärdande (den skyddade just det anropet).
- Nya rader i `starter_pack_offer_codes`. Tabellen och dess migration lämnas orörda, vi slutar bara skriva till den.

## Vad som byggs

1. Popup och quiz samlar in e-post precis som i dag och sparar den till nyhetsbrevet. Svaret innehåller nu den fasta koden direkt. Enda kontrollen: har erbjudandet nått 500 inlösen?
2. Mejlmallen `starter-offer-code` skickas som förut, men med `STARTER199`.
3. När räknaren når 500 visas det befintliga "slutsålt"-läget – samma UI, ny datakälla.

## Räknaren "X av 500 kvar"

Räknas på faktiska ordrar via den befintliga orderwebhooken, som redan verifierar Shopifys signatur innan något läses.

Så läses koden ur ordern: webhookens JSON innehåller en lista `discount_codes`, där varje post har ett `code`-fält (plus belopp och typ). Vi jämför varje `code` skiftlägesokänsligt mot `STARTER199`. Finns den, loggas en rad. Ordernumret sparas som unik nyckel, så samma order aldrig kan räknas två gånger även om Shopify skickar om webhooken (samma idempotensmönster som redan används där).

Ny tabell `starter_offer_redemptions`: order-id (unikt), e-post i lowercase, belopp och tidpunkt.

Skyddsregler för tabellen, samma mönster som övriga känsliga tabeller:
- Radskydd påslaget, inga policyer för besökare eller inloggade – alltså ingen åtkomst alls utifrån.
- Endast backend-rollen får läsa och skriva; anon och authenticated får inga rättigheter.
- Antalet visas publikt via en befintlig, avgränsad funktion som bara returnerar en siffra – aldrig e-postadresser eller ordrar.

`getStarterOfferCount` pekas om till att räkna rader i den nya tabellen istället för utfärdade koder.

## Rörs inte

Adminpanelens rabattflöde och dess behörighetskontroll, rabattens villkor (200 kr fast avdrag, Starter Pack, en gång per beställning, en per kund, 500 totalt – allt satt i Shopify), `SHOPIFY_ACCESS_TOKEN` och recensionsmejlen (separat spår), språkdetekteringen och marknadsvalet.

## Filer

`src/lib/starterOffer.server.ts`, erbjudandets serverfunktion och hook, popup/quiz-komponenterna, mejlmallen, samt orderwebhooken och en ny databasmigration.
