# Migration: make plaently.com the single canonical domain

Goal: the Lovable frontend is served from `https://plaently.com`, Shopify stays as commerce/checkout backend via its permanent `plantly-website-cms-fyvdr.myshopify.com` domain, and `plantlymeals.com` is retired into 301s. Nothing is executed in this plan — it is the preparation blueprint plus the exact code edits to make before DNS cutover.

## Phase 1 — Central site config (code, safe to ship before cutover)

Create `src/config/site.ts` as the single source of truth:

```ts
export const SITE_URL = "https://plaently.com";
// Temporary: origin that actually serves /public assets today.
// Flip to SITE_URL in Phase 6, after plaently.com serves the app.
export const ASSET_ORIGIN = "https://www.plantlymeals.com";
export const SHOPIFY_DOMAIN = "plantly-website-cms-fyvdr.myshopify.com";
```

Files to change so every absolute URL reads from it (no behaviour change — they already hardcode `https://plaently.com`, this only removes duplication and makes the flip atomic):

| File | What it owns today |
|---|---|
| `src/components/SEOHead.tsx` | canonical, og:url, hreflang |
| `src/lib/categoryHead.ts` | SSR head for 10 category routes |
| `src/components/Breadcrumbs.tsx` | BreadcrumbList JSON-LD |
| `src/components/NoIndexHead.tsx` | noindex head |
| `src/pages/admin/AdminSEO.tsx` | admin SEO preview URLs |
| `scripts/generate-sitemap.ts` | `BASE_URL` for sitemap `<loc>` |
| `src/lib/productImages.ts` | `ASSET_ORIGIN` (import, keep value) |
| `src/lib/productSeo.ts` | og:image / twitter:image |
| `src/pages/Products.tsx` | Product JSON-LD `url` + `image` |
| `src/routes/index.tsx` | Organization / WebSite JSON-LD, homepage head |
| `src/routes/product.$handle.tsx` | product head + canonical |
| `src/routes/blog_.$slug.tsx` | Article JSON-LD |
| `public/robots.txt` | `Sitemap:` directive (already correct) |

Also in Phase 1: add an apex-vs-www guard so only one hostname is canonical — `SEOHead` and all `head()` builders must emit `https://plaently.com/...` with no `www`, no trailing-slash variants except `/`.

Explicitly NOT changed in Phase 1: `ASSET_ORIGIN` value, DNS, Shopify, redirects.

## Phase 2 — Redirect map (301, path-preserving, no homepage dumping)

Group A — legacy Shopify storefront paths on plaently.com → Lovable routes:

| OLD | NEW | Code |
|---|---|---|
| `/products/<handle>` | `/product/<handle>` | 301 |
| `/collections/all` | `/products` | 301 |
| `/collections/<any>` | `/products` | 301 |
| `/pages/about` | `/about` | 301 |
| `/pages/faq` | `/faq` | 301 |
| `/pages/contact` | `/contact` | 301 |
| `/policies/privacy-policy` | `/integritetspolicy` | 301 |
| `/policies/terms-of-service` | `/kopsvillkor` | 301 |
| `/policies/shipping-policy` | `/frakt` | 301 |
| `/blogs/news/<slug>` | `/blog/<slug>` | 301 |
| `/blogs/news` | `/blog` | 301 |
| `/cart`, `/checkout`, `/account*` | leave to Shopify checkout domain — no redirect | — |

Group B — routes that already exist in the Lovable app and must resolve 200 on plaently.com after cutover (no redirect needed, listed for validation): `/`, `/products`, `/about`, `/contact`, `/faq`, `/blog`, `/blog/$slug`, `/blog/category/$slug`, `/nutrition`, `/lifestyle`, `/shipping`, `/frakt`, `/privacy-policy`, `/integritetspolicy`, `/terms-of-service`, `/kopsvillkor`, `/high-protein-meals`, `/proteinrika-maltider`, `/nyttig-snabbmat`, `/healthy-fast-food`, `/halsosamma-snabbmaltider`, `/healthy-instant-meals`, `/plant-based-meals`, `/plantbaserade-maltider`, `/protein-cups`, `/proteinkoppar`, `/product/$handle`.

Group C — non-indexable, keep excluded in robots: `/admin*`, `/mcp`, `/unsubscribe`.

Group D — Phase 10, plantlymeals → plaently: `https://(www.)plantlymeals.com/*` → `https://plaently.com/*`, 301, path + query preserved, 1:1.

## Phase 3 — Product mapping (12 routes)

Lovable serves `/product/<handle>`; Shopify serves `/products/<handle>`. Same handles, so redirects are mechanical.

| Shopify handle | Current Shopify URL | Lovable handle | Target | Redirect |
|---|---|---|---|---|
| plant-based-fusilli-bolognese | /products/plant-based-fusilli-bolognese | fusilli-bolognese | /product/plant-based-fusilli-bolognese | yes |
| plant-based-pasta-carbonara | /products/plant-based-pasta-carbonara | pasta-carbonara | /product/plant-based-pasta-carbonara | yes |
| plant-based-yellow-curry-rice | /products/plant-based-yellow-curry-rice | yellow-curry-rice | /product/plant-based-yellow-curry-rice | yes |
| plant-based-smoky-bbq-lentils | /products/plant-based-smoky-bbq-lentils | smoky-bbq-lentils | /product/plant-based-smoky-bbq-lentils | yes |
| starter-pack-12-cups-1 | /products/starter-pack-12-cups-1 | starter-pack-12-cups-1 | /product/starter-pack-12-cups-1 | yes |
| monthly-box-24-cups | /products/monthly-box-24-cups | monthly-box-24-cups | /product/monthly-box-24-cups | yes |
| office-pack-48-cups | /products/office-pack-48-cups | office-pack-48-cups | /product/office-pack-48-cups | yes |
| big-office-pack-96-cups | /products/big-office-pack-96-cups | big-office-pack-96-cups | /product/big-office-pack-96-cups | yes |
| bolognese-box-12-cups | /products/bolognese-box-12-cups | bolognese-box-12-cups | /product/bolognese-box-12-cups | yes |
| carbonara-box-12-cups | /products/carbonara-box-12-cups | carbonara-box-12-cups | /product/carbonara-box-12-cups | yes |
| smoky-lentils-box-12-cups | /products/smoky-lentils-box-12-cups | smoky-lentils-box-12-cups | /product/smoky-lentils-box-12-cups | yes |
| yellow-curry-box-12-cups | /products/yellow-curry-box-12-cups | yellow-curry-box-12-cups | /product/yellow-curry-box-12-cups | yes |

Legacy aliases already handled in code (`monthly-box-30-cups`, `office-pack-60-cups`, `big-office-pack-120-cups`) keep resolving via `PRODUCT_HANDLE_ALIASES`.

## Phase 4 — DNS cutover (instructions only)

1. In Shopify Admin → Settings → Domains: remove `plaently.com` and `www.plaently.com` as connected storefront domains. Keep `plantly-website-cms-fyvdr.myshopify.com` as the permanent domain — Storefront API, cart and checkout all run on it and are unaffected.
2. At the registrar/Cloudflare, remove the Shopify A/CNAME records for apex and www.
3. In Lovable → Project Settings → Domains: reconnect `plaently.com` and `www.plaently.com` (both are currently `drifted`).
   - A record: `@` → `185.158.133.1`
   - A record: `www` → `185.158.133.1`
   - TXT: `_lovable` → value shown in the connect dialog
4. Set `plaently.com` as **Primary**; Lovable then 301s `www.plaently.com` → `plaently.com`.
5. Keep `plantlymeals.com` + `www.plantlymeals.com` connected as aliases during validation.
6. Do NOT touch in Shopify: myshopify permanent domain, Storefront access token, checkout settings, payment/shipping config, product handles.

## Phase 5 — 15-minute post-cutover validation

For `https://plaently.com` and `https://www.plaently.com`, plus `/products`, `/about`, `/faq`, `/blog`, `/nutrition`, `/lifestyle`, all 10 SEO landing routes and all 12 `/product/...` routes, check:

- HTTP 200 (www → single 301 to apex, no chains)
- correct app content (not Shopify)
- canonical self-references the same URL on plaently.com
- og:url matches canonical; exactly 3 hreflang tags, `x-default` = Swedish
- Product JSON-LD present once, `image` absolute HTTPS and returns 200
- `/images/products/*.webp` returns 200 on plaently.com
- add-to-cart → cart drawer → Storefront API checkout opens on Shopify checkout
- analytics pageviews recording; GA4 / Meta Pixel firing if present
- mobile rendering at 390px

Automate with a Playwright script that walks the URL list and asserts each item.

## Phase 6 — Asset origin flip

Only after Phase 5 passes: change `ASSET_ORIGIN` in `src/config/site.ts` to `SITE_URL`, then re-verify every resolved image URL returns 200 before publishing. No images created or replaced.

## Phase 7 — Sitemap and robots

Re-run `scripts/generate-sitemap.ts` so every `<loc>` is `https://plaently.com/...`; confirm `robots.txt` points at `https://plaently.com/sitemap.xml`. Then assert every sitemap URL returns 200 (no 3xx/4xx/5xx) and self-canonicalizes.

## Phase 8 — Merchant Center (manual, documented)

- Product feed `link` must be `https://plaently.com/product/<handle>` and return 200.
- `image_link` must return 200 and match the Product JSON-LD `image`.
- Keep the Shopify feed sync; if the app owns the feed, update the link template only.
- Do not touch shipping or tax settings.
- Re-fetch feed and confirm no "Unavailable / mismatched value" disapprovals.

## Phase 9 — Search Console

Keep the existing `https://plaently.com/` property. Then: resubmit `sitemap.xml`; URL-inspect `/`, `/products`, the SEO landing pages and 3–4 representative product URLs; request indexing for pages that were 404 during the Shopify period; validate the "Missing field image" rich-result issue; monitor Coverage 404s and canonical selection for 2–3 weeks.

## Phase 10 — Retire plantlymeals.com

After a stable period: 301 `https://(www.)plantlymeals.com/*` → `https://plaently.com/*`, path and query preserved, 1:1, no homepage collapsing. Keep the redirect live for at least 12 months.

## Rollback

Revert DNS to Shopify's records (TTL 300 during the window), re-add the domains in Shopify. Code is unaffected because `plantlymeals.com` stays live as an alias throughout — if plaently.com misbehaves, traffic and canonicals can be pointed back at `www.plantlymeals.com` by reverting one constant.

## Risks

- **Rank dip**: 2–6 weeks of turbulence; current indexed plaently.com URLs are 404 today, so short term this can only improve.
- **DNS propagation**: up to 72h; keep both origins serving during it.
- **SSL provisioning**: brief window before Lovable issues certs — schedule at low traffic.
- **Checkout**: no risk if the myshopify domain is untouched; verified explicitly in Phase 5.
- **Merchant Center**: temporary disapprovals if the feed is not updated promptly after cutover.

## Recommended window

Tuesday–Thursday, 06:00–08:00 CET (lowest observed traffic). Lower DNS TTL to 300s 24h before.

## Execution order

Phase 1 (code, publish) → Phase 2/3 redirect map finalized → Phase 4 DNS → Phase 5 validation → Phase 6 asset flip (publish) → Phase 7 sitemap (publish) → Phase 8 Merchant Center → Phase 9 Search Console → Phase 10 retirement.
