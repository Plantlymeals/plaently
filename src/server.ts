import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const IMMUTABLE_ASSET_PATTERN = /^\/images\/.+\.(webp|avif|png|jpe?g|svg|gif|ico)$/i;
const LONG_LIVED_ASSET_PATTERN = /^\/(favicon\.ico|favicon(-\d+x\d+)?\.png|apple-touch-icon\.png|placeholder\.svg)$/i;

// Static files are served by the platform's asset handler, which does not read
// a Netlify/Cloudflare Pages style public/_headers file. Set caching here.
function applyAssetCacheHeaders(request: Request, response: Response): Response {
  if (response.status !== 200 && response.status !== 304) return response;
  const { pathname } = new URL(request.url);
  const immutable = IMMUTABLE_ASSET_PATTERN.test(pathname);
  if (!immutable && !LONG_LIVED_ASSET_PATTERN.test(pathname)) return response;

  const headers = new Headers(response.headers);
  headers.set(
    "cache-control",
    immutable ? "public, max-age=31536000, immutable" : "public, max-age=604800",
  );
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Dead WordPress-era legacy URLs: answer 410 Gone so Google drops them.
// Matches ONLY the six conditions below — never query params in general,
// so utm_*, ?page=, ?s= and ?q= keep working normally.
const GONE_BODY =
  '<!doctype html><html lang="sv"><head><meta charset="utf-8">' +
  '<meta name="robots" content="noindex"><title>410 Gone</title></head>' +
  "<body><h1>410 Gone</h1><p>Den h\u00e4r sidan finns inte l\u00e4ngre.</p></body></html>";

function isGoneLegacyUrl(request: Request): boolean {
  const url = new URL(request.url);
  const q = url.searchParams;
  const p = q.get("p");
  return (
    q.has("feed") ||
    (q.has("p") && p !== null && p !== "" && /^\d+$/.test(p)) ||
    q.has("cat") ||
    q.has("page_id") ||
    q.has("replytocom") ||
    url.pathname === "/feed/" ||
    url.pathname === "/comments/feed/"
  );
}

// Single source of truth for permanent redirects: legacy WordPress-era
// aliases, stale Shopify handles and the former English URLs. Exact path
// matches only, lowercased and without trailing slash. Every target is a final
// destination that answers 200 — never another key in this map — so each
// redirect is exactly one hop.
const PERMANENT_REDIRECTS: Record<string, string> = {
  // Legacy / alternate home paths
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

  // Policy pages — aliases point straight at the Swedish destination
  "/privacy": "/integritetspolicy",
  "/integritet": "/integritetspolicy",
  "/terms": "/kopsvillkor",
  "/villkor": "/kopsvillkor",
  "/leverans": "/frakt",
  "/delivery": "/frakt",

  // Phase 2: former English URLs → their Swedish counterpart
  "/blog/best-high-protein-vegan-meals": "/blog/best-high-protein-vegan-meals-sv",
  "/blog/healthy-instant-meals-for-busy-people": "/blog/healthy-instant-meals-for-busy-people-sv",
  "/blog/quick-healthy-lunch-ideas": "/blog/quick-healthy-lunch-ideas-sv",
  "/blog/what-to-eat-for-lunch-at-work": "/blog/what-to-eat-for-lunch-at-work-sv",
  "/blog/why-meal-cups-beat-powders-and-shakes": "/blog/darfor-slar-maltidskoppar-pulver-och-shakes",
  "/healthy-fast-food": "/nyttig-snabbmat",
  "/high-protein-meals": "/proteinrika-maltider",
  "/plant-based-meals": "/plantbaserade-maltider",
  "/healthy-instant-meals": "/halsosamma-snabbmaltider",
  "/protein-cups": "/proteinkoppar",
  "/shipping": "/frakt",
  "/privacy-policy": "/integritetspolicy",
  "/terms-of-service": "/kopsvillkor",
};

/** Stale Shopify product handles → corrected handles. */
const HANDLE_REDIRECTS: Record<string, string> = {
  "office-pack-60-cups": "office-pack-48-cups",
  "big-office-pack-120-cups": "big-office-pack-96-cups",
  "monthly-box-30-cups": "monthly-box-24-cups",
};

// Returns the final destination path for a request, or null when the URL is
// already canonical. Handles alias paths, stale product handles, the legacy
// /products/:slug pattern and trailing-slash normalisation in one pass.
function resolvePermanentRedirect(request: Request): string | null {
  const url = new URL(request.url);
  const raw = url.pathname;

  // Case-sensitive internal endpoints (server function RPC ids, API routes)
  // must never be rewritten - their ids are base64 and contain uppercase.
  const rawLower = raw.toLowerCase();
  if (
    rawLower.startsWith("/_serverfn/") ||
    rawLower.startsWith("/api/") ||
    rawLower.startsWith("/_build/") ||
    rawLower.startsWith("/.mcp/") ||
    rawLower.startsWith("/.well-known/")
  ) {
    return null;
  }

  const path = raw.length > 1 ? raw.replace(/\/+$/, "").toLowerCase() : raw.toLowerCase();


  const mapped = PERMANENT_REDIRECTS[path];
  if (mapped && mapped !== raw) return `${mapped}${url.search}`;

  const productMatch = path.match(/^\/(?:product|products)\/([^/]+)$/);
  if (productMatch) {
    const handle = productMatch[1] ?? "";
    const primary = `/product/${HANDLE_REDIRECTS[handle] ?? handle}`;
    return primary === raw ? null : `${primary}${url.search}`;
  }

  // Never rewrite case-sensitive file/asset or tool paths: Vite bundles carry
  // mixed-case hashes and /.mcp tool names are camelCase, so lowercasing them
  // 301s a real file to a 404. Skip anything with a file extension or under a
  // reserved prefix.
  const lastSegment = path.slice(path.lastIndexOf("/") + 1);
  if (
    lastSegment.includes(".") ||
    path.startsWith("/_build/") ||
    path.startsWith("/.mcp/") ||
    path.startsWith("/.well-known/") ||
    path.startsWith("/images/")
  ) {
    return null;
  }

  // Trailing slash / uppercase variants of page paths are duplicates too.
  if (path !== raw && path !== "") return `${path}${url.search}`;

  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    if (isGoneLegacyUrl(request)) {
      return new Response(GONE_BODY, {
        status: 410,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    const redirectTarget = resolvePermanentRedirect(request);
    if (redirectTarget) {
      return new Response(null, { status: 301, headers: { location: redirectTarget } });
    }


    try {

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applyAssetCacheHeaders(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
