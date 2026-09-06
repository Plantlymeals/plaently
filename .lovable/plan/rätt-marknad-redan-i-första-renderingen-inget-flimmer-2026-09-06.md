# Rätt marknad redan i första renderingen (inget flimmer)

Idag gissas besökarens marknad först i webbläsaren. Under serverrenderingen antas alltid Sverige, så en brittisk eller europeisk besökare ser svensk frakt och valuta ett ögonblick innan sidan hoppar till rätt värden. Planen flyttar avgörandet till servern, som redan känner till besökarens land.

## Så här löses det

1. **Ny ren mappning i `src/lib/markets.ts`:** `marketFromCountry(country: string | null): Market` — `"SE"` → SE, `"GB"` (och `"UK"`) → UK, land i den befintliga `EU_COUNTRIES`-listan → EU, annars och vid `null` → SE.
2. `**beforeLoad` på rot-routen (`src/routes/__root.tsx`):** anropar `getVisitorCountry()` server-side och returnerar `{ geoMarket: marketFromCountry(country) }`. Route-typen utökas till `createRootRouteWithContext<{ queryClient: QueryClient }>()` med `beforeLoad`-resultatet påslaget automatiskt av TanStack Router, och värdet följer med dehydrerat till klienten. Anropet slås in i try/catch så att ett geo-fel aldrig kan blockera sidladdningen (fallback: SE).
3. **Hook för att läsa värdet i komponenter som inte är route-komponenter:** `useRouteContext({ from: "__root__", select: (c) => c.geoMarket })` från `@tanstack/react-router`. Det är den hook vi landar på — den fungerar överallt under rot-outleten utan att komponenten själv behöver vara en route.
4. **Ny hook `useEffectiveMarket(): Market` i `src/stores/marketStore.ts`:** `hasUserOverride ? market (store) : geoMarket (context)`. Store:n skrivs aldrig från geo-värdet, bara läses. `useMarketConfig()` blir `MARKETS[useEffectiveMarket()]`, så `CartDrawer.tsx`, `BundleSection.tsx` och `ShippingBadge.tsx` behöver inga ändringar.
5. **Tre direktläsare migreras** till `useEffectiveMarket()`: `MarketSelector.tsx` (rad 17), `NewsletterPopup.tsx` (rad 22), `Shipping.tsx` (rad 169). All skrivning via `setMarket`/`hasUserOverride` lämnas orörd.
6. **Startvärdet i store:n** byts från `detectMarket()` till fast `"SE"`. Bekräftat efter genomsökning: `detectMarket()` används ingen annanstans i `src/` än på den raden, så funktionen tas bort som död kod (`TZ_TO_MARKET` likaså, om den bara används där).

## Verifiering innan publicering

- `curl` mot preview med `x-vercel-ip-country: GB`, `: DE` och `: SE` och kontroll av att den råa HTML:en redan innehåller rätt frakt-/valutatext (79/6/49 respektive tröskel) — jag klistrar in rå output, inte en sammanfattning.
- Playwright-skärmdumpar för samma tre länder som visar rätt värden vid första render utan synlig växling.
- Test med `plantely-market` + `hasUserOverride: true` i localStorage: sparat val vinner över geo vid återbesök.
- Kontroll att kundvagn, fraktmärke, marknadsväljare, nyhetsbrevspopup och fraktsidan alla visar samma marknad för samma besökare.

En liten brasklapp på deras egen verifieringsplan: `curl` med manuellt satta `x-vercel-ip-country`/`cf-ipcountry`-headers fungerar bara som test om deras förhandsgranskningsmiljö faktiskt sitter bakom samma edge (Cloudflare/Vercel) som produktionen — annars kan headern plockas bort eller skrivas över av deras egen proxy innan den når servern. Inget jag behöver blockera på, men värt att de kollar mot den riktiga [plaently.com](http://plaently.com)-domänen om preview-testet ger konstiga resultat.

## Rörs inte

`getVisitorCountry()` självt, `AutoLanguage.tsx` och språkdetekteringen, kundvagnens paketrekommendation, styckköps-ändringen, Shopify-katalogen, valutalogiken.