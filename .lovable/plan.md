# 199 kr Starter Pack-erbjudande + automatiskt språkval

Ersätter det trasiga 10 %-löftet med en riktig engångskod per ny kund, max 500 st, och gör språkvalet landsbaserat för förstagångsbesökare.

## Steg 1 — Databas (godkänns separat)

Ny tabell `starter_pack_offer_codes`:
- e-post (unik, alltid lowercase), kod, Shopify-prisregel-id, Shopify-rabattkod-id, utfärdad tid, marknad (SE/EU), inlöst tid (kan fyllas i senare av orderflödet).
- Ingen åtkomst från webbläsaren: bara backend får läsa/skriva raderna (skyddar e-postadresser och koder).
- En liten publik funktion som bara returnerar antalet utfärdade koder, så sidan kan visa "X av 500 kvar" utan att exponera personuppgifter.

## Steg 2 — Serverfunktion som utfärdar koden

Ny serverfunktion (körs på servern, aldrig i webbläsaren) som:
1. Validerar e-postformat.
2. Finns e-posten redan → svar `already_claimed`.
3. Antal rader ≥ 500 → svar `sold_out`.
4. Annars: skapar kod `STARTER-XXXXXX`, anropar befintliga `runDiscountAction({action:'create'})` i `src/lib/shopifyDiscounts.server.ts` med fast rabattbelopp så Starter Pack landar på 199 kr, `usage_limit: 1`, `once_per_customer: true`, begränsad till Starter Pack-produkten.
5. Sparar raden och returnerar koden.

Teknik: `createServerFn` i `src/lib/starterOffer.functions.ts` + `starterOffer.server.ts`. Shopify-anropet återanvänder befintlig token-hantering; ingen ny hemlighet behövs. `runDiscountAction` görs anropbar utan admin-inloggning genom att flytta admin-kontrollen till den befintliga admin-funktionen (den nya funktionen är publik men skriver bara enligt reglerna ovan).

Antaganden att bekräfta:
- Ordinarie Starter Pack-pris används för att räkna ut rabattbeloppet i SEK. För EU-besökare skapas motsvarande fast belopp i EUR (ca 19 EUR) — säg till om du vill ha ett annat EU-pris.
- E-posten sparas även i `newsletter_subscribers` som idag.

## Steg 3 — Popup, quiz och mejl

- `NewsletterPopup.tsx` och `MealFinderQuiz.tsx`: texterna byts från 10 % till 199 kr-erbjudandet (svenska + engelska i `src/lib/i18n.ts`).
- Formuläret anropar nya serverfunktionen och visar tre lägen: kod utfärdad (koden visas direkt, med kopieringsknapp), redan använt, slutsålt (formuläret döljs för nya besökare).
- Räknare "X av 500 kvar" i popupen och på Starter Pack-produktsidan, hämtad från den publika räknefunktionen. Detta gör "Begränsat erbjudande"-badgen sann.
- Ny mejlmall `starter-offer-code` som skickar den riktiga koden; `newsletter-welcome` slutar användas för det här flödet.

## Steg 4 — Automatiskt gränssnittsspråk efter land

- Servern läser besökarens land från hostingens geo-header och skickar det till sidan.
- `useLangStore` i `src/lib/i18n.ts`: finns sparad preferens → använd den. Annars: Sverige → svenska, alla andra länder → engelska. Ingen landsuppgift → svenska som idag.
- Växlingsknappen i `Header.tsx` fungerar exakt som idag och sparas som tidigare — den vinner alltid över automatiken.
- Gäller endast gränssnittstexter. Innehållet på kategori-, produkt- och bloggsidor rörs inte. `detectMarket()` (frakt/valuta) lämnas orörd i detta bygge.

## Rörs inte

`src/server.ts` (410-regeln och 301-blocket), `public/robots.txt`, sitemap-genereringen, produktinnehåll och strukturerad data.
