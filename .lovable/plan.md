# Localize 3 remaining /products links on product pages

Implements the uploaded brief exactly. All three lines confirmed in `src/pages/Products.tsx` (ProductDetail).

## Change (one file: `src/pages/Products.tsx`)
- After `const { t } = useLocaleTranslation(pageLocale);` (line 58) add:
  `const productsListPath = \`${pageLocale === "sv" ? "" : \`/${pageLocale}\`}/products\`;`
- Replace `"/products"` with `productsListPath` in:
  1. Not-found back button (line 177)
  2. Breadcrumb "Products" item (line 249)
  3. "Back to products" link above the image (line 254)

## Not touched
Products list component, `Breadcrumbs.tsx` (Home link), `STARTER_PACK_PATH`, any other file.

## Verification
- Diff: 1 added + 3 changed lines, only this file.
- `bun run check:seo`: 0 errors.
- /en/product/… and /de/product/… breadcrumb + back link go to /en/products and /de/products; Swedish product page still goes to /products.
