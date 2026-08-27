# Fix: plaently.com serves Shopify instead of the Lovable app

## What I verified just now (read-only)

- Lovable domain status: `plaently.com` (primary) and `www.plaently.com` are both **active/connected**, project is published.
- DNS at Simply.com is **correct**:
  - `plaently.com` A -> `185.158.133.1`
  - `www.plaently.com` A -> `185.158.133.1`
  - `_lovable.plaently.com` TXT -> verification value present
  - So yes, `185.158.133.1` is the right Lovable IP and your records are right.
- Despite that, `https://plaently.com/` returns **Shopify storefront HTML** (Shopify checkout token, `shopify-digital-wallet`, `/cdn/shopifycloud/...` scripts), and `https://plaently.com/about` returns **404**.
- `https://plaently.lovable.app/` 302-redirects to `https://plaently.com/`, so the Lovable app itself is fine and published.

## Root cause

The domain is still **connected as a storefront domain inside Shopify**. Shopify and Lovable both terminate custom domains on the same shared edge (Cloudflare for SaaS), and Shopify's registration for `plaently.com` still wins the hostname routing. So requests never reach the Lovable app, no matter what the A-record says. The blank/odd page you see is the Shopify storefront, and every app route (`/about`, `/products`, `/product/...`) 404s because Shopify has no such pages.

DNS is not the problem. Nothing needs to change at Simply.com.

## Fix (manual steps in Shopify, ~5 minutes)

1. Shopify Admin -> Settings -> Domains.
2. Set the primary domain to `plantly-website-cms-fyvdr.myshopify.com` (the permanent domain) if it is not already.
3. **Remove** `plaently.com` and `www.plaently.com` from the connected domains list.
4. Wait 5-15 minutes for the hostname release to propagate at the edge.
5. Reload `https://plaently.com/` — it should now serve the Lovable app.

Checkout, cart and Storefront API keep working: they run on the permanent `*.myshopify.com` domain, which is untouched.

## Correct target DNS (already in place — confirm only)

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.158.133.1` |
| A | `www` | `185.158.133.1` |
| TXT | `_lovable` | `lovable_verify=...` (already present) |

No CNAME to Shopify, no `shops.myshopify.com` record, no leftover A records to `23.227.38.x`. If Simply.com still has any of those alongside, delete them.

## Verification after the Shopify removal

I will re-check, without changing code:

- `https://plaently.com/` returns Lovable-rendered HTML (no `shopify-checkout-api-token` in the source)
- `https://www.plaently.com/` 301s to the apex
- `/about`, `/products`, `/faq`, `/blog` and the 12 `/product/<handle>` routes return 200
- `/images/products/*.webp` returns 200 on plaently.com
- add-to-cart still opens Shopify checkout

## Follow-up once the domain serves the app

Only after the above passes, the remaining phases from the migration plan apply: flip `ASSET_ORIGIN` in the code from `www.plantlymeals.com` to `https://plaently.com`, regenerate the sitemap, and resubmit in Search Console. Those are code changes and are not part of this fix.
