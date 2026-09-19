# Del 2: Boxsidor med fullständigt innehåll i server-renderad HTML

## Svar på dina två frågor

**1. Svensk textkälla — alternativ 1:** De svenska boxsidorna hämtar den mappade kopp-produktens egen Shopify-beskrivning. Ingen maskinöversättning, ingen duplicerad textfil. Koppens Shopify-beskrivning är redan den granskade originaltexten, och en enda källa gör att uppdateringar i Shopify speglas direkt på både kopp- och boxsidan. Engelska/tyska boxsidor använder samma mappning mot de redan godkända texterna i productCopyEn.ts/productCopyDe.ts.

Rättelse: hämtningen sker via `fetchShopifyProductByHandle` i `src/lib/shopify.ts` (samma funktion laddaren redan använder), inte via `products.functions.ts`.

**2. Server-HTML — du har rätt, och det kräver en större ändring än ursprungsplanen antydde:** Idag hämtar `ProductDetail` produkten i en `useEffect` i webbläsaren (Products.tsx rad 53–70), så ingrediens-/näringsinnehållet finns INTE i den första server-HTML:n. Routerns loader (`loadProductSchemaData` i `src/lib/seoLoaders.ts`) hämtar visserligen hela produkten server-side via `fetchShopifyProductByHandle` — men använder bara pris/bild/titel till `<head>` och kastar brödtexten.

Konkret lösning i den här planen:
- Laddaren i `src/routes/product.$handle.tsx` (och `/en/`, `/de/` motsvarigheterna) utökas till att returnera hela produktobjektet (titel, pris, bilder, varianter, `descriptionHtml`) — för boxar dessutom den mappade koppens `descriptionHtml`. Det är samma Shopify-anrop som redan görs idag, utökade fält kostar inget extra anrop.
- `ProductDetail` läser laddarens data via routerns `useLoaderData` som sin primära datakälla. Den befintliga `useEffect`-hämtningen blir bara en reservväg vid ren klientnavigering om laddardata saknas.
- Resultat: titel, pris, bild och hela ingrediens-/närings-/allergenavsnittet finns i den råa server-HTML:n — inte först efter JavaScript. Verifieras genom att hämta sidans råa HTML med curl och bekräfta att t.ex. "Ingredienser" och näringsvärdestabellen finns med.

## Mappning box → smak

- bolognese-box-12-cups → plant-based-fusilli-bolognese
- carbonara-box-12-cups → plant-based-pasta-carbonara
- smoky-lentils-box-12-cups → plant-based-smoky-bbq-lentils
- yellow-curry-box-12-cups → plant-based-yellow-curry-rice

## Åtgärder

1. Ny mappning `BOX_TO_FLAVOR_HANDLE` i `src/lib/productSeo.ts`.
2. Utöka `loadProductSchemaData` i `src/lib/seoLoaders.ts` (eller en ny systerfunktion) till att även returnera `descriptionHtml` och variant-/bilddata, samt för box-handles hämta den mappade koppens `descriptionHtml`. Behåll befintlig 3-sekunderstimeout — schema/innehåll är best-effort och får aldrig stoppa SSR.
3. `src/routes/product.$handle.tsx`, `en.product.$handle.tsx`, `de.product.$handle.tsx`: laddaren returnerar den utökade datan.
4. `src/pages/Products.tsx` (`ProductDetail`): läs produkten och långtexten från laddardata först; behåll `useEffect`-hämtningen endast som fallback. Språkval per sida:
   - svenska: koppens svenska Shopify-beskrivning (oförändrad originaltext),
   - engelska: `getApprovedEnCopy(smak-handlen)`,
   - tyska: `getApprovedDeCopy(smak-handlen)`,
   - fallback: svenska originaltexten — aldrig maskinöversatt allergen-/näringsdata.
   Pris, bild, titel och köpknapp för boxen ändras inte.
5. Verifiering:
   - curl mot sidans råa HTML (utan JavaScript) för alla fyra boxar på svenska: "Ingredienser", näringsvärdestabellen och allergenavsnittet ska finnas i HTML:n.
   - Samma kontroll för engelska och tyska boxsidor med respektive godkända text.
   - Visuell kontroll i förhandsvisning: pris, bild, titel och köpknapp ser rätt ut.
6. Publicera först efter ditt godkännande av verifieringen.

## Tekniska detaljer

- Ändrade filer: `src/lib/productSeo.ts`, `src/lib/seoLoaders.ts`, `src/routes/product.$handle.tsx`, `src/routes/en.product.$handle.tsx`, `src/routes/de.product.$handle.tsx`, `src/pages/Products.tsx`.
- Boxarnas SEO-metadata i `productSeo.ts` (rad 69–91) ändras inte.
- Ingen ändring av STARTER199, admin-autentisering, routeLang-strukturen eller kassan.
- Risk att bevaka: laddaren körs både server-side och vid klientnavigering — den utökade datan måste vara serialiserbar (ren JSON, inga klassinstanser).
