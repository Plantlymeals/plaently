# Language-aware header/footer links + two Swedish product titles

Implements the uploaded brief exactly.

## Part 1 — Swedish product titles (`src/lib/productSeo.ts`)
Change only `sv.title`:
- fusilli-bolognese: "Vegan Fusilli Bolognese…" → "Vegansk Fusilli Bolognese | 20g Protein, 263 kcal — PLÄNTLY"
- smoky-bbq-lentils: "Vegan Smoky BBQ Lentils…" → "Vegansk Smoky BBQ Lentils | 21g Protein, 228 kcal — PLÄNTLY"
Descriptions, en/de and schema untouched.

## Part 2 — Language-aware links
Page language derived from URL prefix (/en → en, /de → de, otherwise sv), same as `<html lang>`.

**Header:** Products nav item and both "Shop now" buttons go to `/products`, `/en/products` or `/de/products`; label "Produkte" on German pages.

**Footer:**
- Explore list: Products, High protein and Plant-based point to the matching locale page (German labels on /de).
- Bottom Explore column: three-way sv/en/de list with correct paths (also fixes English labels pointing to Swedish paths).
- Flavours & Packs: uses `isEnglishPilotHandle` / `isGermanPilotHandle` — the 4 Boxes + Starter Pack go to `/en/product/…` or `/de/product/…`; Monthly Box, Office Pack, Big Office Pack stay on `/product/…`.

## Not touched
Language toggle button, all other links (Nutrition, Lifestyle, About, Blog, FAQ, Contact, shipping, legal, social, newsletter, cookies), BundleSection, category content/pages, route files.

## Verification
- `bun run check:seo` against preview: expect 0 errors, 0 warnings.
- Spot-check /de/high-protein-meals, /en/products, a Swedish page (unchanged), and the two Swedish product titles.
