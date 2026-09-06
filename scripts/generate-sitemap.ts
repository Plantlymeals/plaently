// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://plaently.com";

const SUPABASE_URL = "https://fpwwjbevjhxbggtkaabc.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd3dqYmV2amh4YmdndGthYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTA5NzAsImV4cCI6MjA4ODUyNjk3MH0.gc-lfNODgXF7_nzAtxJxI7zc_S42BmoWSkskpIsKvHw";

const SHOPIFY_DOMAIN = "plantly-website-cms-fyvdr.myshopify.com";
const SHOPIFY_TOKEN = "589b067e548fcf74b63923620569cb4b";
const SHOPIFY_API_VERSION = "2025-07";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/products", changefreq: "daily", priority: "1.0" },
  { path: "/nutrition", changefreq: "monthly", priority: "0.7" },
  { path: "/lifestyle", changefreq: "monthly", priority: "0.7" },
  { path: "/proteinrika-maltider", changefreq: "monthly", priority: "0.85" },
  { path: "/plantbaserade-maltider", changefreq: "monthly", priority: "0.85" },
  { path: "/nyttig-snabbmat", changefreq: "monthly", priority: "0.9" },
  { path: "/proteinkoppar", changefreq: "monthly", priority: "0.85" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  // Blog category archives
  { path: "/blog/category/future-of-fast-food", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/category/modern-nutrition", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/category/fuel-your-day", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/category/plant-protein-101", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/category/behind-plantly", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/category/conscious-living", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/category/quick-and-real", changefreq: "monthly", priority: "0.7" },
  { path: "/blog/category/performance-and-recovery", changefreq: "monthly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/frakt", changefreq: "yearly", priority: "0.4" },
  { path: "/integritetspolicy", changefreq: "yearly", priority: "0.3" },
  { path: "/kopsvillkor", changefreq: "yearly", priority: "0.3" },
];

async function fetchBlogSlugs(): Promise<SitemapEntry[]> {
  try {
    const now = encodeURIComponent(new Date().toISOString());
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,updated_at&is_published=eq.true&published_at=lte.${now}`,
      { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{ slug: string; updated_at?: string }>;
    // English duplicates now 301 to their Swedish counterparts (src/server.ts),
    // so they must never appear in the sitemap.
    const REDIRECTED_SLUGS = new Set([
      "best-high-protein-vegan-meals",
      "healthy-instant-meals-for-busy-people",
      "quick-healthy-lunch-ideas",
      "what-to-eat-for-lunch-at-work",
      "why-meal-cups-beat-powders-and-shakes",
    ]);
    return rows.filter((r) => !REDIRECTED_SLUGS.has(r.slug)).map((r) => ({
      path: `/blog/${r.slug}`,
      lastmod: r.updated_at?.slice(0, 10),
      changefreq: "monthly",
      priority: "0.7",
    }));
  } catch (e) {
    console.warn("sitemap: blog fetch failed", e);
    return [];
  }
}

async function fetchShopifyHandles(): Promise<SitemapEntry[]> {
  try {
    const query = `{ products(first: 100) { edges { node { handle updatedAt } } } }`;
    const res = await fetch(
      `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
        },
        body: JSON.stringify({ query }),
      },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: { products?: { edges: Array<{ node: { handle: string; updatedAt?: string } }> } };
    };
    const edges = json.data?.products?.edges ?? [];
    // Legacy Shopify handles map to their canonical replacement so the sitemap
    // never lists duplicate URLs. Keep in sync with HANDLE_ALIASES.
    const HANDLE_ALIASES: Record<string, string> = {
      "monthly-box-30-cups": "monthly-box-24-cups",
      "office-pack-60-cups": "office-pack-48-cups",
      "big-office-pack-120-cups": "big-office-pack-96-cups",
    };
    const seen = new Set<string>();
    const entries: SitemapEntry[] = [];
    for (const e of edges) {
      // The `plant-based-` prefix is part of the real Shopify handle and must
      // NOT be stripped — stripping it produced sitemap URLs that 404.
      const raw = e.node.handle;
      const handle = HANDLE_ALIASES[raw] ?? raw;
      if (seen.has(handle)) continue;
      seen.add(handle);
      entries.push({
        path: `/product/${handle}`,
        lastmod: e.node.updatedAt?.slice(0, 10),
        changefreq: "weekly",
        priority: "0.8",
      });
    }
    return entries;
  } catch (e) {
    console.warn("sitemap: shopify fetch failed", e);
    return [];
  }
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

/**
 * English pilot product pages. They are only listed once the manually reviewed
 * English allergen/nutrition text has been approved (see src/data/productCopyEn.ts) —
 * until then the pages are noindex and stay out of the sitemap.
 */
async function englishPilotEntries(): Promise<SitemapEntry[]> {
  const mod = await import("../src/data/productCopyEn");
  return mod.EN_PILOT_HANDLES.filter((h: string) => mod.hasApprovedEnCopy(h)).map((handle: string) => ({
    path: `/en/product/${handle}`,
    changefreq: "weekly" as const,
    priority: "0.7",
  }));
}

async function main() {
  const [blog, products, english] = await Promise.all([
    fetchBlogSlugs(),
    fetchShopifyHandles(),
    englishPilotEntries().catch(() => [] as SitemapEntry[]),
  ]);
  const entries = [...staticEntries, ...blog, ...products, ...english];
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main();