# Ta bort priset på de fyra smakerna + räta upp knapparna

## 1. Inget pris på enskilda smaker

- `src/components/home/ProductOverview.tsx` (startsidans fyra kort): hela prisblocket (rad 54–72, pris + sparbadge) tas bort. Alla kort där är redan filtrerade till enskilda koppar. `price`/`getBundleSavings` blir oanvända och städas bort.
- `src/pages/Products.tsx`, produktlistans grid (rad 419–432): samma prisblock tas bort helt; `SavingsBadge` behålls bara om den används på annat håll i filen.
- `src/pages/Products.tsx`, `ProductDetail` (rad 215–236): prisblocket villkoras med `!isSingleCup`. Paket ser exakt likadana ut som idag (pris, sparbadge, "Lägg i varukorgen").

Ingen annan prisvisning rörs: `BundleSection.tsx`, Starter Pack-highlighten och Starter Pack-sidan är oförändrade.

## 2. Radbrytnings-fixen (så här löser vi den)

Titelraden får en reserverad höjd för två rader i båda kortkomponenterna, i stället för att växa med texten:

- `ProductOverview.tsx` rad 53 (`h3`) och `Products.tsx` rad 418 (`h2`) får `line-clamp-2` plus `min-h-[2.5rem]` (två radhöjder vid `text-sm`/`leading-tight`).
- Titlar på en rad tar då lika mycket plats som titlar på två, så bilden, texten och knappen börjar på samma höjd i hela raden — "Smoky BBQ Lentils" skjuter inte längre ner sin knapp.
- Extra säkerhet: kortets ytterdiv får `flex flex-col h-full` och knappen `mt-auto`, så att knapparna ligger i botten även om något annat innehåll skiljer sig.

## Verifiering

Skärmdumpar av startsidans smaksektion, `/products`, en smaksida (Smoky BBQ Lentils) och Starter Pack-sidan — där pris och "Lägg i varukorgen" ska se ut precis som idag.

## Rörs inte

Ordet "koppar"/"kopp", 199 kr-kampanjen/STARTER199, frakt, marknadsval, adminpanelen och Shopify-katalogen.
