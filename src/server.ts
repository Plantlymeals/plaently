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

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    if (isGoneLegacyUrl(request)) {
      return new Response(GONE_BODY, {
        status: 410,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
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
