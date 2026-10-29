# Paket-sektionen och vegan-märket på rätt språk (de, pl, fr, es, da)

Följer briefen ordagrant. Fyra filer, inga nya.

## Vad som ändras
1. **Produktlistan** (`/de|pl|fr|es|da/products`): vegan/vegetarisk-märket på produktkorten och hela paket-blocket följer sidans språk i stället för SV/EN-växlaren.
2. **Paket-blocket**: alla texter (rubrik, märken, beskrivningar, "vad ingår", knapp, frakt) visas på sidans språk med briefens texter ordagrant.
3. **Fri frakt-märket** på paket över fraktgränsen visar rätt marknad ("Fri frakt till EU" osv.) i stället för alltid Sverige — gäller alla besökare.
4. **Marknadsnamn** översatta per språk (EU → UE på fr/es/pl).
5. **Startsidan** oförändrad.

## Tekniska detaljer
- `src/pages/Products.tsx`: rad 505 `<CupBadges meta={cupMeta} locale={pageLocale} />`, rad 528 `<BundleSection locale={pageLocale} />`. `Index.tsx` rörs inte.
- `src/components/home/BundleSection.tsx`: valfri `locale`-prop, `t = locale ? tLocale(key, locale) : globalT`, `effectiveLang = locale ?? globalLang` i alla `marketLabel`-anrop; fri frakt-märket använder `bundles.freeShipping` på SE annars `bundles.freeShippingMarket` med `{market}`; `freeShipText` tas bort om oanvänd.
- `src/lib/i18n.ts`: briefens 37 `bundles.*`-nycklar i `productPageDe/Pl/Fr/Es/Da` (polska `posiłków` som medveten förenkling).
- `src/lib/markets.ts`: `marketLabel` breddas enligt briefen med fallback till engelska.
- **Avvikelse från briefen:** finska är nu live och sidans språk kan vara `fi`. För att typerna ska hålla accepterar `marketLabel` även `fi` (faller tillbaka på engelska). Finska paket-texter läggs inte till nu, så paket-blocket på `/fi/products` fortsätter visa svenska. Det fixar vi i en separat runda om du skickar finska texter.

## Verifiering
- Typkontroll grön, varje ordbok har 84 nycklar, `check:seo` körs.
- Kontrollera i förhandsvisningen att paket-blocket och märkena syns på rätt språk på alla fem språkens produktsidor, och att startsidan ser ut som innan; skärmdumpar före/efter för `/es/products`.
- Publiceras inte förrän du säger till.
