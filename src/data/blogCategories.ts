// Editorial blog category architecture — 8 tracks, EN + SV pairs.
// Keep `slug` stable (used in URLs and DB filtering).

export interface BlogCategoryDef {
  slug: string;
  en: string;
  sv: string;
  description: { en: string; sv: string };
}

export const BLOG_CATEGORIES: BlogCategoryDef[] = [
  {
    slug: "future-of-fast-food",
    en: "Future of Fast Food",
    sv: "Snabbmatens framtid",
    description: {
      en: "Where fast food is going next — and how PLÄNTLY is helping rewrite the category.",
      sv: "Vart snabbmaten är på väg — och hur PLÄNTLY hjälper till att skriva om kategorin.",
    },
  },
  {
    slug: "modern-nutrition",
    en: "Modern Nutrition",
    sv: "Modern näring",
    description: {
      en: "What real nutrition looks like in 2026 — protein, fibre and the science behind plant-based eating.",
      sv: "Vad riktig näring är 2026 — protein, fiber och vetenskapen bakom plantbaserad kost.",
    },
  },
  {
    slug: "fuel-your-day",
    en: "Fuel Your Day",
    sv: "Energi för dagen",
    description: {
      en: "Lunches, snacks and rituals that keep your focus sharp from morning to clock-off.",
      sv: "Luncher, mellanmål och ritualer som håller fokus skarpt från morgon till kväll.",
    },
  },
  {
    slug: "plant-protein-101",
    en: "Plant Protein 101",
    sv: "Plantprotein 101",
    description: {
      en: "Everything worth knowing about plant protein — sources, blends, quality and how to actually hit your numbers.",
      sv: "Allt värt att veta om plantprotein — källor, blandningar, kvalitet och hur du faktiskt når dina mål.",
    },
  },
  {
    slug: "behind-plantly",
    en: "Behind PLÄNTLY",
    sv: "Bakom PLÄNTLY",
    description: {
      en: "Developed in Sweden, crafted in Italy. The people, decisions and craft behind every cup.",
      sv: "Utvecklat i Sverige, hantverk från Italien. Människorna, besluten och hantverket bakom varje kopp.",
    },
  },
  {
    slug: "conscious-living",
    en: "Conscious Living",
    sv: "Medvetet liv",
    description: {
      en: "Climate, sustainability and a quieter way to eat — without the lecture.",
      sv: "Klimat, hållbarhet och ett lugnare sätt att äta — utan moralkakan.",
    },
  },
  {
    slug: "quick-and-real",
    en: "Quick & Real",
    sv: "Snabbt & äkta",
    description: {
      en: "Recipes, hacks and five-minute rituals that respect both your time and your body.",
      sv: "Recept, hacks och femminutersritualer som respekterar både din tid och din kropp.",
    },
  },
  {
    slug: "performance-and-recovery",
    en: "Performance & Recovery",
    sv: "Prestation & återhämtning",
    description: {
      en: "Training, recovery and the role plant protein plays in how your body shows up.",
      sv: "Träning, återhämtning och hur plantprotein spelar in i hur din kropp presterar.",
    },
  },
];

// Lookup helpers. Categories are stored on blog_posts.category as the *display name*
// in either EN or SV (matches the post's language). We resolve a slug to whichever
// name to filter against based on the active site language.

export function getCategoryDisplayName(slug: string, lang: "sv" | "en"): string | null {
  const def = BLOG_CATEGORIES.find((c) => c.slug === slug);
  if (!def) return null;
  return lang === "sv" ? def.sv : def.en;
}

export function getCategorySlug(displayName: string | null | undefined): string | null {
  if (!displayName) return null;
  const def = BLOG_CATEGORIES.find((c) => c.en === displayName || c.sv === displayName);
  return def?.slug ?? null;
}

export function getCategoryDef(slug: string): BlogCategoryDef | null {
  return BLOG_CATEGORIES.find((c) => c.slug === slug) ?? null;
}