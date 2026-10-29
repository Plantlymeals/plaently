# Finsk produktpilot (/fi/)

Samma mönster som den danska piloten: 9 produktsidor + /fi/products, finsk text ordagrant från briefen (approved: true). Inga finska kategorisidor.

## Vad som byggs
- Nya sidor: `/fi/products` och `/fi/product/<handle>` för de nio pilotprodukterna. Övriga produkter skickas vidare till den svenska sidan.
- Sidan "Tuotetta ei löydy" med knappen "Katso tuotteet" för okända produkter.
- Meny: "Tuotteet", brödsmula: "Etusivu", `lang="fi"`, `fi_FI`.
- Footerns kategorilänkar på /fi/-sidor går till de svenska kategorisidorna (inga döda länkar).
- Sajtkartan: 111 → 121 adresser.

## Tekniska detaljer
- Ny `src/data/productCopyFi.ts` (kopieras från briefens kodblock): FI_PILOT_HANDLES, isFinnishPilotHandle, isFinnishPageReady, getApprovedFiCopy.
- `i18n.ts`: `"fi"` i ProductPageLocale, `productPageFi` (47 nycklar, kontrolleras), `fi`-gren i tLocale i samma steg.
- `productSeo.ts`: 9 fi-titlar/beskrivningar ur briefen, fi-URL:er, getAvailableProductLocales, OG `fi_FI`, fallbacktexter och hreflang fi på produktlistan.
- `productDescription.ts`: fi läggs i gruppen som aldrig maskinöversätts.
- `productSchema.ts` (fi-FI), `SEOHead.tsx` (fi keywords), `Breadcrumbs.tsx`, `Header.tsx`, `Footer.tsx`, `__root.tsx`, `Products.tsx`, `categoryContent.ts` (CategoryLocale exkluderar fi).
- Nya routes `fi.product.$handle.tsx` och `fi.products.tsx` (kopior av da-versionerna).
- `scripts/generate-sitemap.ts` (finnishPilotEntries + /fi/products), `scripts/check-localized-seo.ts` (känner igen /fi).

## Verifiering
Typkontroll, 47 nycklar, 10 nya /fi/-adresser i sajtkartan, SSR-kontroll av en /fi/-sida (lang, titel, canonical, hreflang inkl. fi), check:seo 0 fel.

## Rapport före publicering
Citat av tLocale fi-grenen, isFinnishPageReady bredvid den danska/spanska, bekräftelse om ingen maskinöversättning och footerlänkarna. Publiceras först när du säger till.
