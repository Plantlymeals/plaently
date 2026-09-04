/**
 * Legacy/duplicate URL → primary URL map.
 *
 * These are old or alternate paths that pointed at content which now lives on a
 * single primary URL (WordPress-era paths, plural/singular variants, trailing
 * "index.html"). Redirecting them consolidates link equity so they stop
 * competing with the primary page in Google's index.
 *
 * NOTE: the former English URLs (e.g. /shipping) are redirected in src/server.ts;
 * this map only covers other legacy aliases.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // WordPress-era / alternate home paths
  "/home": "/",
  "/index.html": "/",
  "/index.php": "/",
  "/start": "/",

  // Shop
  "/produkter": "/products",
  "/shop": "/products",
  "/butik": "/products",
  "/store": "/products",

  // Content pages
  "/om-oss": "/about",
  "/om": "/about",
  "/kontakt": "/contact",
  "/kontakta-oss": "/contact",
  "/faqs": "/faq",
  "/vanliga-fragor": "/faq",
  "/fragor-och-svar": "/faq",
  "/blogg": "/blog",
  "/news": "/blog",
  "/nyheter": "/blog",
  "/nutrition-facts": "/nutrition",
  "/naring": "/nutrition",
  "/livsstil": "/lifestyle",

  // Policy pages (primary language variant kept, alias folded in)
  "/privacy": "/integritetspolicy",
  "/integritet": "/integritetspolicy",
  "/terms": "/kopsvillkor",
  "/villkor": "/kopsvillkor",
  "/leverans": "/frakt",
  "/delivery": "/frakt",
};

/** Stale Shopify product handles → corrected handles. */
export const HANDLE_REDIRECTS: Record<string, string> = {
  "office-pack-60-cups": "office-pack-48-cups",
  "big-office-pack-120-cups": "big-office-pack-96-cups",
  "monthly-box-30-cups": "monthly-box-24-cups",
};

const stripTrailingSlash = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/**
 * Resolves a pathname to its primary URL, or null when the path is already
 * primary. Handles legacy path aliases, stale product handles and the legacy
 * /products/:slug pattern.
 */
export const resolveLegacyRedirect = (pathname: string): string | null => {
  const path = stripTrailingSlash(pathname.toLowerCase());

  const mapped = LEGACY_REDIRECTS[path];
  if (mapped && mapped !== pathname) return mapped;

  const productMatch = path.match(/^\/(product|products)\/([^/]+)$/);
  if (productMatch) {
    const [, segment, handle] = productMatch;
    const target = HANDLE_REDIRECTS[handle ?? ""] ?? handle ?? "";
    const primary = `/product/${target}`;
    if (primary !== pathname) return primary;
    return null;
  }

  // Bare trailing slash on any other path (e.g. /about/) is a duplicate too.
  if (path !== pathname && path !== "") return path;

  return null;
};
