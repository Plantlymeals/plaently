# plaently.com serverar nu Lovable-appen — avslutande städning

## Vad jag just verifierade (read-only, live)

- `https://plaently.com/` → 200 och levererar **Lovable-appen** (rätt title, canonical, JSON-LD). Inga Shopify-taggar kvar.
- `https://www.plaently.com/` → 302 till apex.
- `/about`, `/products`, `/faq`, `/blog`, `/product/carbonara-box-12-cups`, `/sitemap.xml` → alla 200.
- `/images/products/pasta-carbonara.webp` → 200 på plaently.com.
- Canonical + hreflang på startsidan pekar korrekt på `https://plaently.com/`.

Domänbytet är alltså klart. Shopify-konflikten är löst.

## Kvar att göra (kodändringar)

1. **Flippa asset-origin till huvuddomänen**
   - `src/lib/productImages.ts`: `ASSET_ORIGIN` från `https://www.plantlymeals.com` → `https://plaently.com`.
   - Effekt: Product JSON-LD `image`, `og:image` och `twitter:image` pekar på huvuddomänen istället för den gamla aliasdomänen.

2. **Rätta hårdkodad bas-URL på två juridiska sidor**
   - `src/pages/PrivacyPolicy.tsx` och `src/pages/Terms.tsx` använder `https://plantlymeals.com` som `baseUrl` för canonical/hreflang → ändra till `https://plaently.com`.

3. **Ersätt preview-baserad og:image på startsidan**
   - Startsidan skickar idag en `r2.dev`-preview-bild som `og:image`/`twitter:image`. Byt till en stabil produktbild på `https://plaently.com/images/hero-product.webp` i `src/routes/index.tsx`.

4. **Regenerera sitemap** via `scripts/generate-sitemap.ts` så alla URL:er är på `plaently.com`, och publicera.

5. **Efter publicering (utanför koden):** skicka in sitemap på nytt i Search Console för `https://plaently.com/`.

## Vad som INTE ändras

Design, checkout, Shopify Storefront API (kör vidare på `*.myshopify.com`), routing och redirect-logik rörs inte.
