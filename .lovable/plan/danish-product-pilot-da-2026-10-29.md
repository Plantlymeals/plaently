# Danish product pilot (/da/)

Same pattern as the Polish, French and Spanish pilots: 9 product pages + `/da/products`, Danish text inserted verbatim from the brief (approved: true). No Danish category pages; footer category links on /da/ pages go to the Swedish category pages.

## What gets built
- Nine Danish product pages under `/da/product/...` (Starter Pack, 4 flavours, 4 boxes) and an overview at `/da/products`.
- "Produkt ikke fundet" page linking to `/da/products`; non-pilot handles redirect to Swedish, as for es.
- Danish titles/descriptions for all nine products, `da_DK` share locale, hreflang da on all language versions.
- Sitemap gains 10 Danish URLs (101 → 111).

## Technical details
1. `src/lib/i18n.ts`: `ProductPageLocale` + `"da"`; `productPageDa` (47 keys from the brief); explicit `da` branch in `tLocale()` (added in the same step, not just type).
2. New `src/data/productCopyDa.ts` from the brief; compare `isDanishPageReady()` with current `isSpanishPageReady()` and flag any divergence.
3. New routes `da.product.$handle.tsx`, `da.products.tsx` (copies of es versions).
4. `productSeo.ts`: `da` entries in PRODUCT_SEO, `OG_LOCALE.da`, `getAvailableProductLocales()` da push, da URLs.
5. `productDescription.ts`: own `da` branch, never machine-translates.
6. `productSchema.ts` (`da-DK`), `SEOHead.tsx` (keywords from brief), `Breadcrumbs.tsx` ("Forside" — self-translated), Header/Footer (routeLocale da, "Produkter"), `__root.tsx` (`lang="da"`), `Products.tsx` da branches.
7. `categoryContent.ts`: exclude `"da"` from CategoryLocale.
8. `scripts/generate-sitemap.ts`: `danishPilotEntries()` + `/da/products`; `scripts/check-localized-seo.ts` recognises `/da`.
9. Verify: typecheck, build, sitemap, SSR HTML of a /da/ page (lang, title, canonical, hreflang), `check:seo` 0 errors.

## Report before publishing
File list, quote of the `da` branch in `tLocale()`, `isDanishPageReady()` next to `isSpanishPageReady()`, confirmation of the description `da` branch and footer category links, build/typecheck results. Not published until you say so.
