# "koppar" → "måltider" — endast i paketräkningen

Strikt avgränsat till den godkända listan. Inget annat ändras.

## Ändringar

1. **`src/lib/i18n.ts`** (fem nycklar)
   - `bundles.cups`: "måltider" / "meals"
   - `bundles.perCup`: "kr / måltid" / "kr / meal"
   - `bundles.mixImageAlt`: "PLÄNTLY proteinmåltider – mix av alla fyra smaker" / "PLÄNTLY protein meals – mix of all four flavours"
   - `mix.cupsLabel`: "måltider valda" / "meals selected"
   - `mix.tooFew`: "Lägg till fler måltider för att fylla paketet." / "Add more meals to fill the pack."

2. **`src/pages/Shipping.tsx`** — frakttabellens "Innehåll"-kolumn (sv + en): "1–3 måltider", "4 måltider", "12 måltider (399 kr)", "24 måltider" / "1–3 meals", "4 meals", "12 meals (SEK 399)", "24 meals". Samt raden `costsSub` ("Enstaka koppar" → "Enstaka måltider" / "Single cups" → "Single meals") och radnamnet "Enstaka kopp"/"Single cup" → "Enstaka måltid"/"Single meal". Bäst-före-texten "tryckt på varje kopp" (fysisk förpackning) lämnas orörd.

3. **`src/components/home/StarterPackHighlight.tsx`** — bildens alt-text: "12 koppar växtbaserade proteinmåltider…" → "12 växtbaserade proteinmåltider…".

4. **`src/lib/productSeo.ts`** — sju paket-/box-titlar i sv/en/de:
   - Monthly Box 24, Office Pack 48, Big Office Pack 96, Bolognese/Carbonara/Smoky Lentils/Yellow Curry Box 12
   - "koppar" → "måltider", "Cups" → "Meals", tyska "Cups" → "Mahlzeiten". Även `schema.name` ("– 24 Cups" → "– 24 Meals") för konsekvens med titlarna.

## Rör inte
`/proteinkoppar` och `/en/protein-cups`, övriga kategoritexter, Footer/internalLinks, transaktionsmejl, tillagningsinstruktioner, produkt-alt-texter, blogCategories, alla URL:er och Shopify-handtag.

## Verifiering
- Diff begränsad till de fyra filerna ovan; build rent.
- Förhandsgranskning: paketkort, mixbyggare och fraktsida visar "måltider".
- `/proteinkoppar` och `/en/protein-cups` oförändrade.
