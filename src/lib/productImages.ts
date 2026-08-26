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
 * Absolute, crawler-safe image URL for Product schema. Falls back through the
 * CMS override, the flavour's public image, then the Shopify image, so bundle
 * pages without a Shopify image still emit a valid "image" field.
 */
export function getSchemaImageUrl(
  title: string | undefined | null,
  overrideUrl?: string | null,
  shopifyUrl?: string | null,
): string | undefined {
  const candidate = overrideUrl || getCupMeta(title)?.publicSrc || shopifyUrl || null;
  if (!candidate) return undefined;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return `https://plaently.com${candidate.startsWith("/") ? "" : "/"}${candidate}`;
}
