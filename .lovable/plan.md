# Cache Shopify data on the server

## Goal
Product pages, the product lists and the category pages are built faster because the server stops calling Shopify on every visit. Prices, availability and texts stay correct within a few minutes. Nothing changes in what visitors see, and the visitor's market (country/currency) keeps being chosen per visitor exactly as today.

## Why this is safe
The product queries to Shopify don't depend on the visitor (no country, no login), so every visitor gets the same answer. Only that shared answer is cached. Cart and checkout calls are never cached.

## What gets cached
- Product list (used by /products, /en/products, /de/products and the category pages): 5 minutes
- Single product by handle (product pages in sv/en/de, including the flavour text for boxes): 5 minutes
- Product image overrides from the database (part of the product list): same 5 minutes
- Errors and "product not found" are not cached (not found at most 60 s), so a temporary Shopify problem doesn't get stuck.

## How it works
Two layers, with stale-while-revalidate:
1. Fast memory cache in the running server instance (instant on repeat requests).
2. Shared edge cache (Cloudflare Cache API) so new server instances also benefit.
When an entry is older than 5 minutes but younger than 1 hour, the old version is served right away and a refresh runs in the background. So a visitor never waits on Shopify after the first fetch.

## Verification
- Typecheck and production build green; `bun run check:seo` 0 errors.
- Measure the server response time (TTFB) for a product page, a product list and a category page before and after, in the preview and on the live site after publishing (goal: well under 800 ms on repeat requests).
- Confirm that a price change in Shopify shows up within about 5 minutes.
- Cart/checkout still work.

## Technical details
- New `src/lib/serverCache.server.ts`: `cached(key, ttlMs, staleMs, loader)` with a module-level Map plus `caches.default` (guarded with `typeof caches`), key `https://cache.plaently.internal/<key>`, JSON body, `Cache-Control: max-age`. Background refresh via `ctx.waitUntil` if available, otherwise fire-and-forget. Dedup of parallel in-flight requests.
- `products.server.ts` `fetchProductListForSsr`: wrap the Shopify fetch + image overrides in `cached("product-list:v1", ...)`; don't cache `error: true`.
- `seoLoaders.ts` uses `fetchShopifyProductByHandle` from the isomorphic loader: add a server-only branch (`createIsomorphicFn` or `import.meta.env.SSR`) that goes through `cached("product:v1:<handle>", ...)`; the browser path stays unchanged (no caching in the client).
- Cart mutations in `shopify.ts` are not touched.
- AGENTS.md: rule "Cache only visitor-independent Shopify reads on the server; never cart/checkout or market-dependent data".
