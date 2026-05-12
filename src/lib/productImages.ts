import bolognese from "@/assets/cup-bolognese.png";
import carbonara from "@/assets/cup-carbonara.png";
import curry from "@/assets/cup-curry.png";
import bbq from "@/assets/cup-bbq.png";

export type FlavourKey = "bolognese" | "carbonara" | "curry" | "bbq";

export interface CupMeta {
  key: FlavourKey;
  src: string;
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
  bolognese: { key: "bolognese", src: bolognese, protein: 20, kcal: 263, vegan: true },
  carbonara: { key: "carbonara", src: carbonara, protein: 20, kcal: 285, vegan: false },
  curry:     { key: "curry",     src: curry,     protein: 20, kcal: 285, vegan: false },
  bbq:       { key: "bbq",       src: bbq,       protein: 20, kcal: 228, vegan: true },
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
