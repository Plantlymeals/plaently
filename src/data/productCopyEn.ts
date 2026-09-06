import { canonicalizeHandle } from "@/lib/productSeo";

/**
 * English product pilot.
 *
 * Only these five products get an English URL (`/en/product/{handle}`).
 * Every other handle redirects to the Swedish page.
 */
export const EN_PILOT_HANDLES = [
  "starter-pack-12-cups-1",
  "plant-based-fusilli-bolognese",
  "plant-based-pasta-carbonara",
  "plant-based-yellow-curry-rice",
  "plant-based-smoky-bbq-lentils",
] as const;

export function isEnglishPilotHandle(handle: string): boolean {
  return (EN_PILOT_HANDLES as readonly string[]).includes(canonicalizeHandle(handle));
}

/**
 * Manually reviewed English ingredient / nutrition / allergen copy.
 *
 * SAFETY RULE: allergen and nutrition text must never come from the
 * rule-based auto-translation. An entry is only used when it has been read and
 * approved by whoever owns the product data (`approved: true`). Until then the
 * English page renders the original Swedish source text — never a guess — and
 * the page stays `noindex` and out of the sitemap.
 *
 * To publish an English long description: add the handle below with reviewed
 * HTML and set `approved: true`.
 */
export type ApprovedEnCopy = { approved: boolean; html: string };

export const EN_PRODUCT_COPY: Record<string, ApprovedEnCopy> = {
  // "plant-based-fusilli-bolognese": { approved: true, html: "<h3>Ingredients</h3>..." },
};

export function getApprovedEnCopy(handle: string | undefined): string | null {
  if (!handle) return null;
  const entry = EN_PRODUCT_COPY[canonicalizeHandle(handle)];
  return entry?.approved ? entry.html : null;
}

/** True once the English long text for this product has been reviewed. */
export function hasApprovedEnCopy(handle: string | undefined): boolean {
  return getApprovedEnCopy(handle) !== null;
}
