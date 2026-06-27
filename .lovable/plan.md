
# Marknadsanpassad frakt på landingpage

## Mål
Visa rätt fraktpris och fri-frakt-tröskel beroende på vilken marknad besökaren kommer ifrån — Sverige, EU eller UK — på startsidan och i relaterade frakt-texter.

## Fraktmatris

| Marknad     | Standardfrakt | Fri frakt över |
|-------------|---------------|----------------|
| Sverige 🇸🇪 | 49 SEK        | 399 SEK        |
| EU 🇪🇺      | 69 SEK        | 599 SEK        |
| UK 🇬🇧      | 79 SEK        | 699 SEK        |

## Marknadsdetektion (hybrid)
1. **Automatisk** via `Intl.DateTimeFormat().resolvedOptions().timeZone` + `navigator.language` → mappa till `SE | EU | UK | OTHER` (OTHER faller tillbaka på EU). Detta är klient-sidan, gratis, inget extra API-anrop, ingen GDPR-cookie krävs.
2. **Manuell override**: en liten landväljare (flagga + landnamn) i toppen av landingpage och i Footer. Valet sparas i `localStorage` så det är persistent.
3. Valt land sparas i en ny Zustand-store `useMarketStore` så alla komponenter delar samma värde.

## Vad ändras visuellt
- **HeroSection / StarterPackHighlight**: liten "Fri frakt över X kr i {marknad}"-rad under CTA.
- **BundleSection**: badgen `bundles.freeShipping` triggas dynamiskt baserat på vald marknads tröskel istället för hårdkodade 499 kr. Featurelistan `bundles.feat.freeShipSe` byts ut mot dynamisk text "Fri frakt i {marknad}".
- **Shipping-sidan (`/frakt`)**: ny tabellsektion högst upp som visar alla tre marknader sida vid sida, med vald marknad markerad.
- Ny komponent `MarketSelector` (flag-dropdown) som syns i Header och Footer.

## Texter & i18n
Lägg till nya nycklar i `src/lib/i18n.ts`:
- `market.se`, `market.eu`, `market.uk`
- `shipping.freeOver` → "Fri frakt över {amount} {currency} i {market}"
- `shipping.standardCost` → "Frakt {amount} {currency}"
- `market.changeCountry` → "Byt land"

Allt två-språkigt (sv/en).

## Filer som skapas/ändras

**Nya filer**
- `src/lib/markets.ts` — konstanter (matrisen ovan), detekteringsfunktion, typ `Market = "SE" | "EU" | "UK"`.
- `src/stores/marketStore.ts` — Zustand-store med `persist`-middleware.
- `src/components/MarketSelector.tsx` — dropdown med flaggor.
- `src/components/ShippingBadge.tsx` — liten återanvändbar badge ("Fri frakt över X kr i Y").

**Uppdateras**
- `src/lib/i18n.ts` — nya nycklar.
- `src/components/home/HeroSection.tsx` — visa `ShippingBadge` under CTA.
- `src/components/home/StarterPackHighlight.tsx` — visa dynamisk fraktinfo.
- `src/components/home/BundleSection.tsx` — dynamisk tröskel + landnamn i features.
- `src/components/Header.tsx` + `src/components/Footer.tsx` — placera `MarketSelector`.
- `src/pages/Shipping.tsx` — ny jämförelsetabell SE/EU/UK.

## Viktig avgränsning
Detta är **endast presentation** på sajten. Faktiska fraktpriser i Shopify-kassan måste konfigureras separat i Shopify Admin → Settings → Shipping & delivery (zoner för SE, EU, UK med matchande priser och thresholds). Jag inkluderar en checklista i slutet av implementationen för det manuella Shopify-steget så att texten på sajten alltid matchar verkligheten i kassan.

## Öppna frågor (default-val)
Du svarade inte på de andra två frågorna, så jag går vidare med:
- **Detektion**: hybrid (auto via tidszon/språk + manuell väljare). Säg till om du hellre vill ha bara manuell väljare eller IP-baserad detektion via en edge function.
- **Checkout-påverkan**: bara text på sajten (checkout sköts av Shopify). Säg till om du också vill att jag ska guida dig genom Shopify shipping zone-uppsättningen.
