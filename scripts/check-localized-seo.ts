/**
 * Localized SEO check.
 * Usage: bun scripts/check-localized-seo.ts [baseUrl]   (default http://localhost:8080)
 *
 * For every URL in public/sitemap.xml, fetches the server-rendered HTML and flags:
 *  - duplicate metadata: more than one <title>/description/canonical on a page,
 *    or the same title/description shared by different pages
 *  - wrong language tags: <html lang> / og:locale not matching the URL locale,
 *    canonical not self-referencing, missing or non-reciprocal hreflang
 *  - broken links: internal hrefs and hreflang targets answering >= 400
 * Warnings (non-failing): links on /en or /de pages that lead to another locale.
 * Exits 1 when any error is found.
 */
import { readFileSync } from "fs";

const SITE = "https://plaently.com";
const base = (process.argv[2] ?? "http://localhost:8080").replace(/\/$/, "");
type Loc = "sv" | "en" | "de";

const localeOf = (path: string): Loc =>
  path === "/en" || path.startsWith("/en/") ? "en" : path === "/de" || path.startsWith("/de/") ? "de" : "sv";

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1];
const tags = (html: string, re: RegExp) => html.match(re) ?? [];

const errors: string[] = [];
const warnings: string[] = [];
const err = (p: string, m: string) => errors.push(`${p}: ${m}`);

const sitemap = readFileSync("public/sitemap.xml", "utf8");
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const pathSet = new Set(paths);

const titles = new Map<string, string[]>();
const descs = new Map<string, string[]>();
const alternates = new Map<string, Map<string, string>>();
const internalLinks = new Map<string, Set<string>>();

async function get(url: string) {
  const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "localized-seo-check" } });
  return { status: res.status, text: await res.text() };
}

async function checkPage(path: string) {
  const { status, text: html } = await get(base + path);
  if (status !== 200) return err(path, `status ${status}`);
  const head = html.split(/<\/head>/i)[0];
  const loc = localeOf(path);

  const titleTags = tags(head, /<title[^>]*>[\s\S]*?<\/title>/gi);
  const descTags = tags(head, /<meta[^>]+name="description"[^>]*>/gi);
  const canon = tags(head, /<link[^>]+rel="canonical"[^>]*>/gi);
  if (titleTags.length !== 1) err(path, `${titleTags.length} <title> tags`);
  if (descTags.length !== 1) err(path, `${descTags.length} meta descriptions`);
  if (canon.length !== 1) err(path, `${canon.length} canonical links`);

  const title = decode(titleTags[0]?.replace(/<[^>]+>/g, "") ?? "");
  const desc = decode(attr(descTags[0] ?? "", "content") ?? "");
  if (title) titles.set(title, [...(titles.get(title) ?? []), path]);
  if (desc) descs.set(desc, [...(descs.get(desc) ?? []), path]);

  const canonHref = attr(canon[0] ?? "", "href");
  if (canonHref && canonHref !== SITE + path) err(path, `canonical points to ${canonHref}`);

  const htmlLang = attr(html.match(/<html[^>]*>/i)?.[0] ?? "", "lang");
  if (htmlLang?.slice(0, 2) !== loc) err(path, `<html lang="${htmlLang}"> but page is ${loc}`);
  const ogLocale = attr(tags(head, /<meta[^>]+property="og:locale"[^>]*>/gi)[0] ?? "", "content");
  if (ogLocale && ogLocale.slice(0, 2) !== loc) err(path, `og:locale ${ogLocale} but page is ${loc}`);

  const alts = new Map<string, string>();
  for (const t of tags(head, /<link[^>]+hreflang="[^"]+"[^>]*>/gi)) {
    const hl = attr(t, "hreflang")!;
    if (alts.has(hl)) err(path, `duplicate hreflang="${hl}"`);
    alts.set(hl, attr(t, "href") ?? "");
  }
  alternates.set(path, alts);
  if (alts.size > 0 && alts.get(loc) !== SITE + path) err(path, `hreflang="${loc}" does not point to itself`);

  const links = new Set<string>();
  for (const t of tags(html, /<a\s[^>]*href="[^"]+"[^>]*>/gi)) {
    const href = decode(attr(t, "href")!);
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const clean = href.split(/[?#]/)[0] || "/";
    links.add(clean);
    if (loc !== "sv" && localeOf(clean) !== loc && pathSet.has(clean) && alternatesKnownLocalized(clean))
      warnings.push(`${path}: links to other-language page ${clean}`);
  }
  internalLinks.set(path, links);
}

// A Swedish path counts as "has a translation" if some sitemap page lists it as an sv alternate.
const svWithTranslation = new Set<string>();
const alternatesKnownLocalized = (p: string) => localeOf(p) !== "sv" || svWithTranslation.has(p);

async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  const q = [...items];
  await Promise.all(Array.from({ length: n }, async () => { while (q.length) await fn(q.shift()!); }));
}

// Pass 1: learn which sv pages have translations (from hreflang), pass 2: full check.
await pool(paths, 6, async (p) => {
  const { text } = await get(base + p).catch(() => ({ text: "" }));
  for (const t of tags(text.split(/<\/head>/i)[0], /<link[^>]+hreflang="sv"[^>]*>/gi)) {
    const h = attr(t, "href");
    if (h?.startsWith(SITE)) svWithTranslation.add(new URL(h).pathname);
  }
});
await pool(paths, 6, (p) => checkPage(p).catch((e) => err(p, `fetch failed: ${e}`)));

// Reciprocal hreflang
for (const [path, alts] of alternates) {
  for (const [hl, href] of alts) {
    if (hl === "x-default" || !href.startsWith(SITE)) continue;
    const target = new URL(href).pathname;
    if (target === path) continue;
    const back = alternates.get(target);
    if (!back) err(path, `hreflang="${hl}" target ${target} is not in the sitemap`);
    else if (![...back.values()].includes(SITE + path)) err(path, `hreflang="${hl}" → ${target} does not link back`);
  }
}

for (const [v, ps] of titles) if (ps.length > 1) err(ps.join(", "), `share the same title "${v}"`);
for (const [v, ps] of descs) if (ps.length > 1) err(ps.join(", "), `share the same description "${v.slice(0, 60)}…"`);

// Broken internal links
const allLinks = new Set<string>();
for (const s of internalLinks.values()) s.forEach((l) => allLinks.add(l));
const broken = new Map<string, number>();
await pool([...allLinks].filter((l) => !pathSet.has(l) || !alternates.has(l)), 6, async (l) => {
  const { status } = await get(base + l).catch(() => ({ status: 0 }));
  if (status === 0 || status >= 400) broken.set(l, status);
});
for (const [page, links] of internalLinks)
  for (const l of links) if (broken.has(l)) err(page, `broken link ${l} (status ${broken.get(l)})`);

console.log(`Checked ${paths.length} pages, ${allLinks.size} internal links against ${base}`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ` + [...new Set(warnings)].join("\n  "));
if (errors.length) {
  console.log(`\n${errors.length} error(s):\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log("\nNo errors.");
