import bolognese from "@/assets/cup-bolognese.png";
import carbonara from "@/assets/cup-carbonara.png";
import curry from "@/assets/cup-curry.png";
import bbq from "@/assets/cup-bbq.png";

export interface CupMeta {
  src: string;
  protein: number; // grams
  kcal: number;
  vegan: boolean;
}

const MAP: Array<{ keys: string[]; meta: CupMeta }> = [
  { keys: ["bolognese", "fusilli"], meta: { src: bolognese, protein: 20, kcal: 380, vegan: true } },
  { keys: ["carbonara"], meta: { src: carbonara, protein: 20, kcal: 410, vegan: false } },
  { keys: ["curry", "yellow", "rice"], meta: { src: curry, protein: 20, kcal: 390, vegan: false } },
  { keys: ["bbq", "lentil", "smoky"], meta: { src: bbq, protein: 20, kcal: 370, vegan: true } },
];

export function getCupMeta(title: string | undefined | null): CupMeta | null {
  if (!title) return null;
  const lower = title.toLowerCase();
  for (const m of MAP) {
    if (m.keys.some((k) => lower.includes(k))) return m.meta;
  }
  return null;
}

// Backwards-compatible helper
export function getCupImage(title: string | undefined | null): string | null {
  return getCupMeta(title)?.src ?? null;
}
