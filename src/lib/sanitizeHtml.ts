import DOMPurify from "dompurify";

/**
 * DOMPurify's default export is an uninitialized factory without a `window`,
 * so `.sanitize` is undefined during SSR (Worker/Node). Use the real thing in
 * the browser and a conservative string-level fallback on the server.
 */
const SERVER_STRIP_TAGS = /<\s*\/?\s*(script|style|iframe|object|embed|link|meta|base|form)\b[^>]*>/gi;
const SERVER_STRIP_BLOCK = /<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
// Separator may be whitespace OR a slash (`<img/onerror=...>` is valid HTML).
// Lookbehind keeps the separator itself intact.
const SERVER_STRIP_EVENT_ATTRS = /(?<=[\s/])on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const SERVER_STRIP_JS_URLS = /\s(?:href|src|xlink:href)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi;

function serverSanitize(html: string): string {
  return html
    .replace(SERVER_STRIP_BLOCK, "")
    .replace(SERVER_STRIP_TAGS, "")
    .replace(SERVER_STRIP_EVENT_ATTRS, "")
    .replace(SERVER_STRIP_JS_URLS, "");
}

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  const purify = DOMPurify as unknown as { sanitize?: (input: string) => string };
  if (typeof window !== "undefined" && typeof purify.sanitize === "function") {
    return purify.sanitize(html);
  }
  return serverSanitize(html);
}
