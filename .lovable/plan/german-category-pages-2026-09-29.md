# German category pages

## Goal
Add four German category pages that mirror the English ones, using the German copy supplied in the brief word for word:
- `/de/high-protein-meals`
- `/de/healthy-fast-food`
- `/de/plant-based-meals`
- `/de/protein-cups`

This gives Google German pages it can match to German buying searches.

## What changes
1. **German content**: add the supplied German text (headings, intro, benefits, quick answer, comparison, FAQ, related links) for each category. The healthy-fast-food FAQ has no euro price, as the brief specifies.
2. **Page metadata**: each German page gets a German title and description, `de_DE` locale, its own canonical, and German FAQ and breadcrumb structured data. All Swedish, English and German category pages point to each other with sv/en/de/x-default hreflang.
3. **Page texts and links**: the fixed labels ("Products", "Explore more", "FAQ", the protein cups/nutrition sentence) get a German version. On German pages, the buttons, breadcrumbs and in-text links go to `/de/products`.
4. **Sitemap**: adds the four German URLs.

## Not touched
The general site language setting, product pages, `/products` and its English/German versions, and the German legal/info pages. The Swedish and English category text stays exactly as it is. The only change on those pages is the added German hreflang link.

## Note
Like the existing Swedish and English text, the German copy labels individual flavours "vegan" or "vegetarian" as a factual flavour label. The brand line itself still says "plant-based protein".

## Technical details
- `src/data/categoryContent.ts`: type the content as `Record<CategoryKey, Record<ProductPageLocale, CategoryContent>>`. Add `relatedDe()` and a `de` block for all five keys (including the unrouted `healthy-instant-meals`). Widen the `getCategoryContent` lang parameter to `ProductPageLocale`.
- `src/lib/categoryHead.ts`: three-way self URL and og:locale, plus a `de` hreflang alternate, as in the brief.
- `src/pages/categories/CategoryPage.tsx`: `routeLang: ProductPageLocale`, three-way `pagePath`/`productsPath`, and a `UI_TEXT` record in place of the inline sv/en ternaries.
- New `src/routes/de.{high-protein-meals,healthy-fast-food,plant-based-meals,protein-cups}.tsx`, mirroring the `en.*` files.
- `scripts/generate-sitemap.ts`: four entries with the same priority as EN.
- Verify: fetch all four German pages without a saved language setting and check the H1, canonical, hreflang, FAQ JSON-LD and `/de/products` links; check that the sv/en category pages are unchanged apart from the new alternate; typecheck.
