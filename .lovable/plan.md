# Del 2: Boxsidor med fullständigt innehåll (produktlista, ingredienser, näringsvärden, råvaror)

## Svar på din fråga: vi gör alternativ 1

De svenska boxsidorna hämtar kopp-produktens egen Shopify-beskrivning via en fast mappning box→smak. Ingen maskinöversättning, ingen duplicerad textfil.

Motivering:
- Svenska är huvudmarknaden och koppens Shopify-beskrivning är redan den granskade originaltexten som visas på kopp-sidorna idag.
- Kopp-produkterna finns kvar i Shopify (de togs bara bort från butikens listningar), så texten kan fortfarande hämtas.
- En enda källa: uppdateras texten i Shopify speglas det direkt på både kopp- och boxsidan. En svensk textfil (alternativ 2) skulle riskera att driva isär från Shopify-texten över tid.
- Samma mappning löser även engelska och tyska boxsidor: de använder de redan godkända texterna i productCopyEn.ts/productCopyDe.ts för motsvarande smak.

## Mappning box → smak

- bolognese-box-12-cups → plant-based-fusilli-bolognese
- carbonara-box-12-cups → plant-based-pasta-carbonara
- smoky-lentils-box-12-cups → plant-based-smoky-bbq-lentils
- yellow-curry-box-12-cups → plant-based-yellow-curry-rice

## Åtgärder

1. Ny mappning `BOX_TO_FLAVOR_HANDLE` i `src/lib/productSeo.ts` (bredvid befintlig produktmetadata).
2. Produkt-sidans laddare (`src/routes/product.$handle.tsx` samt `/en/` och `/de/` motsvarigheter): när adressen är en box hämtas även den mappade kopp-produktens beskrivning från Shopify i samma anrop.
3. `src/pages/Products.tsx` (ProductDetail): på boxsidor renderas
   - svenska: koppens svenska Shopify-beskrivning (oförändrad originaltext),
   - engelska: `getApprovedEnCopy(smak-handlen)`,
   - tyska: `getApprovedDeCopy(smak-handlen)`,
   - fallback om något saknas: svenska originaltexten — aldrig maskinöversatt allergen-/näringsdata.
   Pris, bild, titel och köpknapp för boxen ändras inte.
4. Verifiering i förhandsvisning: öppna alla fyra boxsidor på svenska, engelska och tyska och bekräfta att ingrediens-, närings- och allergenavsnitten visas med rätt språk och att pris/bild ser rätt ut.
5. Publicera först efter ditt godkännande av verifieringen.

## Tekniska detaljer

- Svensk boxtext kommer alltså INTE från en ny productCopySv.ts-fil och INTE från boxens egen Shopify-beskrivning — den hämtas live från den mappade kopp-produktens Shopify-beskrivning via Storefront API (befintlig `src/lib/products.functions.ts`-väg, SSR).
- Boxsidorna är redan indexbara produktsidor med egen SEO-metadata i `src/lib/productSeo.ts` (rad 69–91) — den ändras inte.
- Ingen ändring av STARTER199, admin-autentisering, routeLang-strukturen eller kassan.
