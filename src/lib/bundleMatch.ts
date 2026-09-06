import type { BundleRow } from "@/lib/bundlesApi";
import type { ShopifyProduct } from "@/lib/shopify";

/** Parse a CMS price string ("399 kr", "399,00") into a number. */
export function parsePriceNumber(value: string | null | undefined): number | null {
  if (!value) return null;
  const cleaned = String(value).replace(/[^\d.,-]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Match a CMS bundle to its Shopify product. Explicit link wins, name match is the fallback. */
export function findShopifyMatch(
  bundle: BundleRow,
  products: ShopifyProduct[]
): ShopifyProduct | null {
  if (bundle.shopify_product_id) {
    const direct = products.find((p) => p.node.id === bundle.shopify_product_id);
    if (direct) return direct;
  }
  const n = bundle.name.toLowerCase().trim();
  if (!n) return null;
  const exact = products.find((p) => p.node.title.toLowerCase().trim() === n);
  if (exact) return exact;
  return (
    products.find(
      (p) =>
        p.node.title.toLowerCase().includes(n) ||
        n.includes(p.node.title.toLowerCase())
    ) ?? null
  );
}

export type BundleSuggestion = {
  bundle: BundleRow;
  product: ShopifyProduct;
  price: number;
  currencyCode: string;
  imageUrl: string | null;
};

/**
 * Cheapest bundle whose price alone closes the gap to free shipping.
 * Returns null when no single bundle covers it.
 */
export function pickFreeShippingBundle(
  bundles: BundleRow[],
  shopifyBundles: ShopifyProduct[],
  remaining: number
): BundleSuggestion | null {
  if (remaining <= 0) return null;
  const candidates: BundleSuggestion[] = [];
  for (const b of bundles) {
    const product = findShopifyMatch(b, shopifyBundles);
    if (!product) continue;
    const shopifyPrice = parseFloat(product.node.priceRange.minVariantPrice.amount);
    const price = parsePriceNumber(b.price) ?? (Number.isFinite(shopifyPrice) ? shopifyPrice : null);
    if (price === null || price <= 0 || price < remaining) continue;
    candidates.push({
      bundle: b,
      product,
      price,
      currencyCode: product.node.priceRange.minVariantPrice.currencyCode ?? "SEK",
      imageUrl: b.image_url ?? product.node.images?.edges?.[0]?.node?.url ?? null,
    });
  }
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => a.price - b.price)[0] ?? null;
}
