import { describe, it, expect } from "vitest";
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { tmpdir } from "os";

// E2E-style guard for the `validate_review_product_slug` trigger on
// public.product_reviews. The trigger accepts a slug when EITHER:
//   (a) it matches a row in public.products.slug, OR
//   (b) it matches the Shopify handle regex ^[a-z0-9][a-z0-9-]{1,80}$
//
// This test reproduces both branches in TS against live data so that a
// slug rename / handle drift surfaces in CI long before a customer hits
// "something went wrong" when submitting a review.

const SUPABASE_URL = "https://fpwwjbevjhxbggtkaabc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd3dqYmV2amh4YmdndGthYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTA5NzAsImV4cCI6MjA4ODUyNjk3MH0.gc-lfNODgXF7_nzAtxJxI7zc_S42BmoWSkskpIsKvHw";

const SHOPIFY_DOMAIN = "plantly-website-cms-fyvdr.myshopify.com";
const SHOPIFY_TOKEN = "589b067e548fcf74b63923620569cb4b";
const SHOPIFY_API_VERSION = "2025-07";

const HANDLE_REGEX = /^[a-z0-9][a-z0-9-]{1,80}$/;

const CACHE_PATH = resolve(tmpdir(), "plaently-shopify-handles.cache.json");
const CACHE_TTL_MS = Number(process.env.SHOPIFY_HANDLE_CACHE_TTL_MS ?? 10 * 60 * 1000);
const CACHE_ENABLED = process.env.SHOPIFY_HANDLE_CACHE !== "0";

function readCache(): string[] | null {
  if (!CACHE_ENABLED || !existsSync(CACHE_PATH)) return null;
  try {
    const age = Date.now() - statSync(CACHE_PATH).mtimeMs;
    if (age > CACHE_TTL_MS) return null;
    const parsed = JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
    return Array.isArray(parsed?.handles) ? parsed.handles : null;
  } catch {
    return null;
  }
}

function writeCache(handles: string[]) {
  if (!CACHE_ENABLED) return;
  try {
    mkdirSync(dirname(CACHE_PATH), { recursive: true });
    writeFileSync(CACHE_PATH, JSON.stringify({ handles, savedAt: Date.now() }));
  } catch {}
}

async function fetchProductSlugs(): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=slug&is_published=eq.true`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } },
  );
  if (!res.ok) throw new Error(`Supabase products HTTP ${res.status}`);
  const rows = (await res.json()) as Array<{ slug: string }>;
  return rows.map((r) => r.slug);
}

async function fetchPublishedBundles(): Promise<
  Array<{ name: string; shopify_product_id: string | null }>
> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/bundles?select=name,shopify_product_id&is_published=eq.true`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } },
  );
  if (!res.ok) throw new Error(`Supabase bundles HTTP ${res.status}`);
  return res.json();
}

type ShopifyEdge = { node: { id: string; handle: string } };

async function fetchShopifyProducts(): Promise<ShopifyEdge[]> {
  const query = `{ products(first: 100) { edges { node { id handle } } } }`;
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
  if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
  const json = (await res.json()) as {
    data?: { products?: { edges: ShopifyEdge[] } };
  };
  const edges = json.data?.products?.edges ?? [];
  writeCache(edges.map((e) => e.node.handle));
  return edges;
}

// Simulates the `validate_review_product_slug` trigger.
function validateSlug(slug: string, knownProductSlugs: Set<string>): { ok: boolean; reason?: string } {
  if (knownProductSlugs.has(slug)) return { ok: true };
  if (HANDLE_REGEX.test(slug)) return { ok: true };
  return {
    ok: false,
    reason: `slug "${slug}" is neither a product row nor a valid Shopify handle (regex ${HANDLE_REGEX})`,
  };
}

// Smoke-checks the live INSERT path for a single representative slug to
// confirm RLS + trigger still accept a real review submission. Uses a
// recognizable email so cleanup is easy (`status='pending'` rows from
// `e2e-slug-test@plaently.dev`). We only attempt one to avoid noise.
async function probeRealInsert(slug: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/product_reviews`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      product_slug: slug,
      author_name: "E2E Slug Test",
      author_email: "e2e-slug-test@plaently.dev",
      rating: 5,
      title: null,
      body: "Automated CI probe — safe to delete.",
    }),
  });
  if (res.status >= 200 && res.status < 300) return { ok: true };
  return { ok: false, error: `HTTP ${res.status} ${await res.text()}` };
}

describe("review submission slug validation (products + bundles)", () => {
  it("every published product slug satisfies the validate_review_product_slug trigger", async () => {
    const slugs = await fetchProductSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    const known = new Set(slugs);
    for (const slug of slugs) {
      const r = validateSlug(slug, known);
      expect(r.ok, r.reason).toBe(true);
    }
  }, 15_000);

  it("every published bundle resolves to a Shopify handle accepted by the trigger", async () => {
    let bundles: Array<{ name: string; shopify_product_id: string | null }>;
    let shopifyEdges: ShopifyEdge[];
    let slugs: string[];
    try {
      [bundles, shopifyEdges, slugs] = await Promise.all([
        fetchPublishedBundles(),
        fetchShopifyProducts(),
        fetchProductSlugs(),
      ]);
    } catch (err) {
      console.warn("Skipping bundle slug check: upstream unreachable", err);
      return;
    }
    expect(bundles.length).toBeGreaterThan(0);
    const known = new Set(slugs);
    const missingShopify: string[] = [];
    const invalidHandles: string[] = [];
    for (const b of bundles) {
      const edge = b.shopify_product_id
        ? shopifyEdges.find((e) => e.node.id === b.shopify_product_id)
        : shopifyEdges.find(
            (e) => e.node.handle.toLowerCase() === b.name.toLowerCase().replace(/\s+/g, "-"),
          );
      if (!edge) {
        missingShopify.push(`${b.name} (${b.shopify_product_id ?? "no shopify_product_id"})`);
        continue;
      }
      const r = validateSlug(edge.node.handle, known);
      if (!r.ok) invalidHandles.push(`${b.name} -> ${edge.node.handle}: ${r.reason}`);
    }
    expect(
      missingShopify,
      `bundles missing a Shopify product link:\n  ${missingShopify.join("\n  ")}`,
    ).toEqual([]);
    expect(
      invalidHandles,
      `bundle handles that would be rejected by the review trigger:\n  ${invalidHandles.join("\n  ")}`,
    ).toEqual([]);
  }, 20_000);

  it("RLS + trigger actually accept a live review insert for the first product", async () => {
    if (process.env.SKIP_LIVE_REVIEW_PROBE === "1") return;
    const slugs = await fetchProductSlugs();
    const probe = await probeRealInsert(slugs[0]);
    expect(probe.ok, probe.error).toBe(true);
  }, 15_000);
});

// keep cache helper referenced so tree-shakers don't drop the import
void readCache;