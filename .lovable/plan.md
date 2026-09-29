# Make the product list language-aware (EN + DE) and fix CTA links

## Goal
Visitors arriving from English or German pages land on a product list in their own language (at `/en/products` and `/de/products`), and search engines see the right language when they fetch the page. No new copy is written. All text already exists in the translations.

## What changes
1. **New English and German product list pages**: `/en/products` and `/de/products`. They show the same products as `/products`, with localized title, description, canonical, og:locale and full sv/en/de/x-default hreflang.
2. **Swedish `/products`**: uses the same shared metadata builder, so it also gets complete hreflang. It otherwise behaves exactly as before.
3. **Product list component**: reads its language from the page URL, not the saved language setting, so the page arrives already in the right language. Product cards, the "Try in Starter Pack" button and breadcrumbs link to the `/en/...` or `/de/...` versions.
4. **English category pages**: the 3 CTA buttons and the breadcrumb point to `/en/products`.
5. **EN/DE "product not found" pages**: the back link goes to `/en/products` or `/de/products`.
6. **Sitemap**: adds `/en/products` and `/de/products`.

## Not touched
The product SEO table, category content/head files, the global language switcher, product detail logic, and German category pages.

## Technical details
- `src/lib/productSeo.ts`: add `productListUrl(locale)` and `getProductListHead(locale, { noindex })`, using `tLocale("seo.products.title"/"seo.products.description")` and the existing BASE_URL/OG_LOCALE.
- `src/routes/en.products.tsx`, `src/routes/de.products.tsx`: new files that mirror `products.tsx`, with `beforeLoad: () => ({ pageLocale })`, the same loader and the same ItemList JSON-LD.
- `src/routes/products.tsx`: add `beforeLoad` pageLocale "sv" and switch head to `getProductListHead("sv")`.
- `src/pages/Products.tsx` `Products`: read `pageLocale` through `useRouterState` + `useLocaleTranslation` (same as ProductDetail). Localize `SEOHead` path/locale, breadcrumbs, card links and the Starter Pack link.
- `src/pages/categories/CategoryPage.tsx`: `productsPath = lang === "en" ? "/en/products" : "/products"`.
- `en/de.product.$handle.tsx` not-found links, `scripts/generate-sitemap.ts` entries.
- Verify: SSR HTML of all three list pages without localStorage (H1, links, canonical, hreflang), category CTAs, sitemap, and no regression on `/products`.
