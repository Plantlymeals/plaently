# Architecture rules

- Use Katla's hosted widget as the sole cookie-consent authority; load its supplied tag first in the document head and gate analytics through KatlaConsent so consent cannot diverge between banners.
- Keep the footer cookie-settings action routed through the shared consent helper so every page reopens Katla's preference center.- Cache only visitor-independent Shopify reads on the server (via src/lib/serverCache.ts); never cache cart/checkout or market-dependent data, so cached responses can't leak between visitors.
