import { fetchShopifyProductByHandle } from "@/lib/shopify";
import type { ProductOffer, ProductRating } from "@/lib/productSchema";

const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const SUPABASE_KEY = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

/** Never let a slow upstream stall the SSR stream — schema is best-effort. */
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
    ]);
  } catch {
    return fallback;
  }
}

async function restSelect<T>(path: string): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) return [];
  return (await res.json()) as T[];
}

async function fetchRating(productSlug: string): Promise<ProductRating> {
  const rows = await restSelect<{ rating: number }>(
    `public_product_reviews?select=rating&product_slug=eq.${encodeURIComponent(productSlug)}`
  );
  if (!rows.length) return null;
  const sum = rows.reduce((acc, r) => acc + Number(r.rating || 0), 0);
  return { count: rows.length, avg: sum / rows.length };
}

export type ProductSchemaData = {
  offer: ProductOffer;
  rating: ProductRating;
  shopifyImageUrl: string | null;
  name: string | null;
  description: string | null;
};

const EMPTY_PRODUCT_DATA: ProductSchemaData = {
  offer: null,
  rating: null,
  shopifyImageUrl: null,
  name: null,
  description: null,
};

/** Real price/availability/rating for Product JSON-LD, resolved on the server. */
export async function loadProductSchemaData(handle: string): Promise<ProductSchemaData> {
  return withTimeout(
    (async () => {
      const product = await fetchShopifyProductByHandle(handle);
      if (!product) return EMPTY_PRODUCT_DATA;
      const variant = product.variants?.edges?.[0]?.node;
      const price = variant?.price ?? product.priceRange?.minVariantPrice;
      const rating = await fetchRating(product.handle).catch(() => null);
      return {
        offer: price
          ? {
              price: parseFloat(price.amount).toFixed(2),
              currency: price.currencyCode,
              available: variant ? variant.availableForSale : true,
            }
          : null,
        rating,
        shopifyImageUrl: product.images?.edges?.[0]?.node?.url ?? null,
        name: product.title ?? null,
        description: product.description ?? null,
      } satisfies ProductSchemaData;
    })(),
    3000,
    EMPTY_PRODUCT_DATA
  );
}

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  question_sv: string | null;
  answer_sv: string | null;
  sort_order: number | null;
};

/** Published FAQs, loaded server-side so FAQPage JSON-LD ships in the HTML. */
export async function loadPublishedFaqs(): Promise<FaqRow[]> {
  return withTimeout(
    restSelect<FaqRow>(
      "faqs?select=id,question,answer,question_sv,answer_sv,sort_order&is_published=eq.true&order=sort_order.asc"
    ),
    3000,
    []
  );
}
