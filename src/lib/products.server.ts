import { createClient } from "@supabase/supabase-js";
import { isListableProduct } from "./productFilters";

const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "plantly-website-cms-fyvdr.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export interface ProductListItem {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  price: { amount: string; currencyCode: string };
  image: { url: string; altText: string | null } | null;
}

export interface ProductListResult {
  products: ProductListItem[];
  imageOverrides: Record<string, string>;
  error: boolean;
}

const LIST_QUERY = `
  query GetProductList($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

function cleanProductTitle(title: string): string {
  if (!title) return "";
  const lower = title.toLowerCase();
  if (lower === "starter-pack-12-cups" || lower === "starter-pack-12-cups-1") {
    return "Starter Pack";
  }
  return title.replace(/[—].*$/, "").trim();
}

export async function fetchProductListForSsr(): Promise<ProductListResult> {
  const token = process.env["VITE_SHOPIFY_STOREFRONT_TOKEN"];
  if (!token) {
    console.error("fetchProductListForSsr: VITE_SHOPIFY_STOREFRONT_TOKEN saknas");
    return { products: [], imageOverrides: {}, error: true };
  }

  try {
    const res = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: LIST_QUERY, variables: { first: 20 } }),
    });
    if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors) {
      throw new Error(json.errors.map((e: any) => e.message).join(", "));
    }

    const edges: any[] = json?.data?.products?.edges ?? [];
    const products: ProductListItem[] = edges
      .map((e) => {
        const node = e.node;
        return {
          id: String(node.id),
          title: cleanProductTitle(String(node.title ?? "")),
          handle: String(node.handle ?? ""),
          tags: Array.isArray(node.tags) ? node.tags.map(String) : [],
          price: {
            amount: String(node.priceRange?.minVariantPrice?.amount ?? "0"),
            currencyCode: String(node.priceRange?.minVariantPrice?.currencyCode ?? "SEK"),
          },
          image: node.images?.edges?.[0]?.node
            ? {
                url: String(node.images.edges[0].node.url),
                altText: node.images.edges[0].node.altText ?? null,
              }
            : null,
        } satisfies ProductListItem;
      })
      // Samma filter som klienten — enda implementationen, se productFilters.ts
      .filter((p) => isListableProduct(p.title))
      .sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount));

    let imageOverrides: Record<string, string> = {};
    try {
      const supabaseUrl = process.env["SUPABASE_URL"];
      const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
      if (supabaseUrl && supabaseKey) {
        const pub = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false },
          global: {
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              if (supabaseKey.startsWith("sb_") && h.get("Authorization") === `Bearer ${supabaseKey}`) {
                h.delete("Authorization");
              }
              h.set("apikey", supabaseKey);
              return fetch(input, { ...init, headers: h });
            },
          },
        });
        const { data } = await pub
          .from("products")
          .select("slug,image_url")
          .not("image_url", "is", null);
        for (const r of data ?? []) {
          const row = r as { slug?: string; image_url?: string };
          if (row.slug && row.image_url) imageOverrides[row.slug] = row.image_url;
        }
      }
    } catch (e) {
      // Bildöverstyrningar är en förbättring, inte ett krav — logga och fortsätt.
      console.error("fetchProductListForSsr: image overrides misslyckades", e);
    }

    return { products, imageOverrides, error: false };
  } catch (e) {
    console.error("fetchProductListForSsr: Shopify-hämtning misslyckades", e);
    return { products: [], imageOverrides: {}, error: true };
  }
}
