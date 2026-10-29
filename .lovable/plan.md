# Fix: savings chip and shipping line still in Swedish on pilot product lists

Scope exactly as the brief — two small changes, nothing else.

1. **Savings chip** ("Du sparar 69 SEK · 15%" / "Spara 177 SEK · 19%") on /de, /pl, /fr, /es, /da, /fi product lists: pass the page language to the badge so it uses the already-existing texts (e.g. "Du sparst", "Säästät", "Oszczędzasz").
2. **Shipping line** ("Frakt 6 EUR") on the four boxes: add the six texts from the brief verbatim — Versand / Dostawa / Livraison / Envío / Fragt / Toimitus, followed by amount and currency.

Not touched: home page, Starter Pack highlight, Products page, markets.

## Verification
- Typecheck.
- Open all six pilot product lists in the preview: chip and shipping line in the page language.
- Home page unchanged in Swedish.
- Report back before publishing.

## Technical details
- `src/components/home/BundleSection.tsx`: add `locale={effectiveLang}` to `<SavingsBadge>`. `effectiveLang` falls back to the global sv/en on the home page, so the home result stays the same; confirm its type fits `ProductPageLocale`.
- `src/lib/i18n.ts`: add `"shipping.standardCost"` to productPageDe/Pl/Fr/Es/Da/Fi (each dictionary goes from 86 to 87 keys).
