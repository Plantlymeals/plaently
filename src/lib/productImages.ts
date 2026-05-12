import bolognese from "@/assets/cup-bolognese.png";
import carbonara from "@/assets/cup-carbonara.png";
import curry from "@/assets/cup-curry.png";
import bbq from "@/assets/cup-bbq.png";

const MAP: Array<{ keys: string[]; src: string }> = [
  { keys: ["bolognese", "fusilli"], src: bolognese },
  { keys: ["carbonara"], src: carbonara },
  { keys: ["curry", "rice", "yellow"], src: curry },
  { keys: ["bbq", "lentil", "smoky"], src: bbq },
];

export function getCupImage(title: string | undefined | null): string | null {
  if (!title) return null;
  const lower = title.toLowerCase();
  for (const m of MAP) {
    if (m.keys.some((k) => lower.includes(k))) return m.src;
  }
  return null;
}
