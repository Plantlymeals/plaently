// Central map of keyword-anchored internal links used across the site.
// Anchor text = the target page's focus keyword (SEO), not generic "read more".

export type Lang = "sv" | "en";

export interface InternalLink {
  label: string;
  path: string;
  hint?: string;
}

const LINKS: Record<string, Record<Lang, InternalLink>> = {
  highProtein: {
    sv: { label: "proteinrika måltider", path: "/proteinrika-maltider", hint: "Proteinrik lunch som mättar hela eftermiddagen." },
    en: { label: "high protein meals", path: "/proteinrika-maltider", hint: "High protein lunches that keep you full all afternoon." },
  },
  plantBased: {
    sv: { label: "plantbaserade måltider", path: "/plantbaserade-maltider", hint: "Plantbaserad mat med riktigt protein och fiber." },
    en: { label: "plant-based meals", path: "/plantbaserade-maltider", hint: "Plant-based food with real protein and fibre." },
  },
  fastFood: {
    sv: { label: "nyttig snabbmat", path: "/nyttig-snabbmat", hint: "Snabbmat som faktiskt är nyttig." },
    en: { label: "healthy fast food", path: "/nyttig-snabbmat", hint: "Fast food that is actually good for you." },
  },
  proteinCups: {
    sv: { label: "proteinkoppar", path: "/proteinkoppar", hint: "Instant cup meals med 20 g plantprotein." },
    en: { label: "protein cups", path: "/proteinkoppar", hint: "Instant cup meals with 20 g plant protein." },
  },
  nutrition: {
    sv: { label: "näringsinnehåll", path: "/nutrition", hint: "Protein, fiber och näring — hela profilen." },
    en: { label: "nutrition facts", path: "/nutrition", hint: "Protein, fibre and the full nutrition profile." },
  },
  lifestyle: {
    sv: { label: "vardagsrutiner", path: "/lifestyle", hint: "Så passar PLÄNTLY in i din dag." },
    en: { label: "daily routines", path: "/lifestyle", hint: "How PLÄNTLY fits into your day." },
  },
  products: {
    sv: { label: "alla smaker", path: "/products", hint: "Utforska hela sortimentet." },
    en: { label: "all flavours", path: "/products", hint: "Explore the full range." },
  },
};

export type LinkKey = keyof typeof LINKS;

export const getLink = (key: LinkKey, lang: Lang): InternalLink => (LINKS[key] as Record<Lang, InternalLink>)[lang];

export const getLinks = (keys: LinkKey[], lang: Lang): InternalLink[] =>
  keys.map((k) => getLink(k, lang));

// Homepage hub: points at the five commercial landing pages.
export const HOME_LINK_KEYS: LinkKey[] = [
  "fastFood",
  "highProtein",
  "plantBased",
  "proteinCups",
];

// Blog category slug -> the landing pages that topic should funnel into.
const CATEGORY_TARGETS: Record<string, LinkKey[]> = {
  "future-of-fast-food": ["fastFood", "proteinCups", "products"],
  "modern-nutrition": ["nutrition", "highProtein", "plantBased"],
  "fuel-your-day": ["fastFood", "highProtein", "lifestyle"],
  "plant-protein-101": ["plantBased", "highProtein", "nutrition"],
  "behind-plantly": ["products", "plantBased", "lifestyle"],
  "conscious-living": ["plantBased", "lifestyle", "fastFood"],
  "quick-and-real": ["fastFood", "products", "proteinCups"],
  "performance-and-recovery": ["highProtein", "proteinCups", "nutrition"],
};

export function getCategoryLandingLinks(
  categorySlug: string | null | undefined,
  lang: Lang,
): InternalLink[] {
  const keys = (categorySlug && CATEGORY_TARGETS[categorySlug]) || [
    "fastFood",
    "highProtein",
    "plantBased",
  ];
  return getLinks(keys, lang);
}
