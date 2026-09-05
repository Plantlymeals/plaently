# 199 kr Starter Pack-erbjudande + automatiskt språkval

Ersätter 10 %-löftet med en riktig engångskod per ny kund, max 500 st totalt, och gör språkvalet landsbaserat för förstagångsbesökare.

## Bekräftelse på säkerhetskraven

- Den nya publika funktionen tar emot **exakt ett** värde: e-postadressen. Inget annat från webbläsaren når Shopify.
- Rabatt (50 %), produkt (Starter Pack), antal användningar (1) och "en gång per kund" är **hårdkodade på servern**.
- Admin-panelens `runDiscountAction` och dess inloggnings- och adminrollskontroll (`requireSupabaseAuth` + `has_role`) **ändras inte alls**. Den nya funktionen är en egen, smal väg till Shopify.

### Skillnaden mellan de två vägarna

| | Admin-panelen | Nya erbjudandefunktionen |
|---|---|---|
| Vem får anropa | Inloggad admin | Vem som helst (besökare) |
| Input | Fri rabattdefinition (list/create/update/disable/delete) | Endast e-postadress |
| Vad kan skapas | Vilken rabatt som helst | Endast 50 % på Starter Pack, 1 användning, en per kund |
| Skyddsräcken | Adminroll | E-postvalidering, en kod per e-post, tak på 500 |

## Steg 1 — Databas

Ny tabell `starter_pack_offer_codes`: e-post (unik, lowercase), kod, Shopify-prisregel-id, Shopify-rabattkod-id, utfärdad tid, marknad (SE/EU), inlöst tid (kan fyllas i senare av orderflödet).

- Webbläsaren kan varken läsa eller skriva raderna — bara backend.
- En liten publik funktion returnerar **enbart antalet** utfärdade koder, för "X av 500 kvar". Inga personuppgifter exponeras.

## Steg 2 — Serverfunktion som utfärdar koden

Ny fil `src/lib/starterOffer.functions.ts` + `starterOffer.server.ts`. Flödet:

1. Validerar e-postformat.
2. E-posten finns redan → `already_claimed`.
3. Antal rader ≥ 500 → `sold_out`.
4. Annars: genererar `STARTER-XXXXXX` och skapar i Shopify Admin API en price rule med `value_type: "percentage"`, `value: -50`, riktad mot Starter Pack-produkten, `usage_limit: 1`, `once_per_customer: true`, samt tillhörande rabattkod. Shopify Markets sköter valutan i kassan.
5. Sparar raden och returnerar koden.

Anropen mot Shopify återanvänder befintlig token-hantering (`getShopifyTokenCandidates` / `shopifyWithFallback`) — ingen ny hemlighet behövs, och admin-vägen rörs inte.

## Steg 3 — Popup, quiz och mejl

- `NewsletterPopup.tsx` och `MealFinderQuiz.tsx`: texten byts från 10 % till 199 kr-erbjudandet, svenska och engelska i `src/lib/i18n.ts`.
- Prisvisning: **199 kr** för marknad SE, **~17,90 €** för marknad EU (samma två marknader som redan finns). Inga nya valutor byggs.
- Formuläret anropar nya funktionen och visar tre lägen: kod utfärdad (kod syns direkt med kopieringsknapp), redan använt, slutsålt (formuläret döljs).
- Räknare "X av 500 kvar" i popupen och på Starter Pack-produktsidan, så "Begränsat erbjudande" blir sant.
- Ny mejlmall `starter-offer-code` som skickar den riktiga koden; `newsletter-welcome` används inte längre i det här flödet.

## Steg 4 — Automatiskt gränssnittsspråk efter land

- Servern läser besökarens land från hostingens geo-header och skickar in det till sidan.
- `useLangStore` i `src/lib/i18n.ts`: sparad preferens vinner alltid. Annars Sverige → svenska, övriga länder → engelska. Saknas landsuppgift → svenska som idag.
- Växlingsknappen i `Header.tsx` fungerar precis som idag och vinner alltid.
- Endast gränssnittstexter. Kategori-, produkt- och bloggsidor samt `detectMarket()` rörs inte.

## Rörs inte

`src/server.ts` (410-regeln och 301-blocket), `public/robots.txt`, sitemap-genereringen, produktinnehåll, strukturerad data och admin-panelens auktorisering.

## Ordning

Databasen först (kräver ditt godkännande), sedan serverfunktionen, därefter popup/quiz/mejl, och sist språkdetekteringen.
