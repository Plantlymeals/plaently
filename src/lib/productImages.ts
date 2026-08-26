import bolognese from "@/assets/cup-bolognese.webp";
import carbonara from "@/assets/cup-carbonara.webp";
import curry from "@/assets/cup-curry.webp";
import bbq from "@/assets/cup-bbq.webp";

export type FlavourKey = "bolognese" | "carbonara" | "curry" | "bbq";

export interface CupMeta {
  key: FlavourKey;
  src: string;
  /** Stable public URL of the same image, for crawler-facing schema/OG use. */
  publicSrc: string;
  protein: number; // grams per serving
  kcal: number;    // per serving
  vegan: boolean;
}

// Per-flavour nutrition. All cups: 20g plant protein per serving (brand standard).
// Carbonara contains dairy/egg-style flavouring — not vegan. Others are vegan.
// Per-serving nutrition (source: NutritionPreview spec).
// Bolognese 75g: 263 kcal, 20.3g protein
// Carbonara 75g: 285 kcal, 20.2g protein
// Yellow Curry & Rice 75g: 285 kcal, 20.4g protein
// Smoky BBQ Lentils 65g: 228 kcal, 20.8g protein
const FLAVOURS: Record<FlavourKey, CupMeta> = {
  bolognese: { key: "bolognese", src: bolognese, publicSrc: "/images/products/fusilli-bolognese.webp", protein: 20, kcal: 263, vegan: true },
  carbonara: { key: "carbonara", src: carbonara, publicSrc: "/images/products/pasta-carbonara.webp", protein: 20, kcal: 285, vegan: false },
  curry:     { key: "curry",     src: curry,     publicSrc: "/images/products/thai-curry.webp", protein: 20, kcal: 285, vegan: false },
  bbq:       { key: "bbq",       src: bbq,       publicSrc: "/images/products/smoky-bbq-lentils.webp", protein: 20, kcal: 228, vegan: true },
};

// Ordered, specific keyword → flavour. First match wins.
// Keep keys narrow so generic words ("rice", "pasta") don't false-match other products.
const TITLE_RULES: Array<{ pattern: RegExp; flavour: FlavourKey }> = [
  { pattern: /carbonara/i,                         flavour: "carbonara" },
  { pattern: /bolognese|fusilli/i,                 flavour: "bolognese" },
  { pattern: /smoky\s*bbq|bbq\s*lentil|lentil/i,   flavour: "bbq" },
  { pattern: /yellow\s*curry|curry/i,              flavour: "curry" },
];

export function getCupMeta(title: string | undefined | null): CupMeta | null {
  if (!title) return null;
  for (const rule of TITLE_RULES) {
    if (rule.pattern.test(title)) return FLAVOURS[rule.flavour];
  }
  return null;
}

export function getCupImage(title: string | undefined | null): string | null {
  return getCupMeta(title)?.src ?? null;
}

/**
 * Display title for a product. Carbonara and Yellow Curry contain milk protein,
 * so the "Plant-Based" prefix must be stripped from their names everywhere.
 */
export function displayProductTitle(title: string | undefined | null): string {
  if (!title) return "";
  const meta = getCupMeta(title);
  if (meta && !meta.vegan) {
    return title.replace(/plant[\s\u2011\u2010-]*based\s*/gi, "").trim();
  }
  return title;
}

/**
 * Origin used for absolute, crawler-facing asset URLs.
 * Must be a domain that actually serves this app's /public assets — plaently.com
 * currently resolves to the Shopify storefront and 404s on /images/*, which made
 * Product JSON-LD images unfetchable for Google.
 */
export const ASSET_ORIGIN = "https://www.plantlymeals.com";

/** Existing multi-cup imagery already used on the site for mixed bundles. */
const MIXED_BUNDLE_IMAGE = "/images/products/starter-pack.webp";

/**
 * Handle → existing public image. Single-flavour boxes reuse the flavour cup
 * image; mixed packs reuse their existing pack imagery. No new images.
 */
const HANDLE_IMAGES: Array<{ pattern: RegExp; src: string }> = [
  { pattern: /^(plant-based-)?(pasta-)?carbonara/i, src: "/images/products/pasta-carbonara.webp" },
  { pattern: /^(plant-based-)?(fusilli-)?bolognese/i, src: "/images/products/fusilli-bolognese.webp" },
  { pattern: /(smoky|bbq|lentil)/i, src: "/images/products/smoky-bbq-lentils.webp" },
  { pattern: /curry/i, src: "/images/products/thai-curry.webp" },
  { pattern: /^big-office-pack/i, src: "/images/products/big-office-pack.webp" },
  { pattern: /^office-pack/i, src: "/images/products/office-pack.webp" },
  { pattern: /^athlete/i, src: "/images/products/athlete-pack.webp" },
  { pattern: /^starter-pack/i, src: "/images/products/starter-pack.webp" },
  { pattern: /^monthly-box/i, src: MIXED_BUNDLE_IMAGE },
];

function toAbsolute(candidate: string): string {
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return `${ASSET_ORIGIN}${candidate.startsWith("/") ? "" : "/"}${candidate}`;
}

function isCrawlableUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(url)) return false;
  if (/lovable\.app|lovableproject\.com|\.r2\.dev/i.test(url)) return false; // preview-only hosts
  if (/^http:\/\//i.test(url)) return false;
  if (/^https:\/\/plaently\.com\//i.test(url)) return false; // does not serve app assets
  return true;
}

/**
 * Single source of truth for structured-data / social product images.
 * Priority: CMS override → handle mapping → flavour image → Shopify image →
 * existing mixed-bundle image. Always returns an absolute HTTPS URL.
 */
export function resolveProductImageUrl(input: {
  handle?: string | null;
  title?: string | null;
  overrideUrl?: string | null;
  shopifyUrl?: string | null;
}): string {
  const { handle, title, overrideUrl, shopifyUrl } = input;
  if (overrideUrl && isCrawlableUrl(toAbsolute(overrideUrl))) return toAbsolute(overrideUrl);
  if (handle) {
    const hit = HANDLE_IMAGES.find((rule) => rule.pattern.test(handle));
    if (hit) return toAbsolute(hit.src);
  }
  const flavour = getCupMeta(title)?.publicSrc;
  if (flavour) return toAbsolute(flavour);
  if (shopifyUrl && isCrawlableUrl(shopifyUrl)) return shopifyUrl;
  return toAbsolute(MIXED_BUNDLE_IMAGE);
}

/**
 * Absolute, crawler-safe image URL for Product schema.
 * Kept for existing callers; delegates to resolveProductImageUrl.
 */
export function getSchemaImageUrl(
  title: string | undefined | null,
  overrideUrl?: string | null,
  shopifyUrl?: string | null,
  handle?: string | null,
): string {
  return resolveProductImageUrl({ handle: handle ?? null, title: title ?? null, overrideUrl: overrideUrl ?? null, shopifyUrl: shopifyUrl ?? null });
}

