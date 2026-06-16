/**
 * Shared language-purity heuristics used by both the static i18n dictionary
 * test and the dynamic CMS content test.
 */

export const ALLOWLIST = new Set<string>([
  // Brand & company
  "pläntly", "plantly", "plaently", "se559400472201",
  "vretensborgsvägen", "hägersten", "hello@plaently.com",
  // Product / pack names (kept identical in both languages)
  "starter", "pack", "monthly", "box", "office", "big",
  "fusilli", "bolognese", "pasta", "carbonara", "smoky",
  "bbq", "lentils", "yellow", "curry", "rice",
  // Shared abbreviations / units / proper nouns
  "faq", "20g", "5", "min", "kr", "sek", "eu", "ai",
  "linkedin", "instagram", "tiktok", "facebook",
  "italy", "italien", "sweden", "sverige", "italia",
  // Cognates / identical in both languages
  "protein", "proteins", "vegan", "menu", "ok",
]);

export const ENGLISH_STOPWORDS = [
  "the", "and", "with", "your", "you", "our", "for", "from",
  "this", "that", "what", "when", "how", "why", "ready",
  "shop", "now", "meals", "meal", "healthy", "plant-based",
  "shipping", "free", "subscribe", "subscription", "about",
  "contact", "home", "nutrition", "lifestyle", "blog",
  "products", "discover", "learn", "more", "join", "today",
  "available", "delivered", "minutes", "without", "between",
  "because", "should", "would", "could", "their", "there",
  "which", "while", "every", "everyone", "people",
];

export const SWEDISH_STOPWORDS = [
  "och", "eller", "men", "att", "som", "med", "för", "från",
  "den", "det", "är", "var", "vad", "när", "hur", "varför",
  "handla", "köp", "måltid", "måltider", "frakt", "fri",
  "näring", "livsstil", "produkter", "hem", "kontakt",
  "klart", "minuter", "hälsosam", "hälsosamma", "plantbaserad",
  "plantbaserat", "prenumerera", "prenumeration", "erbjudande",
  "tillagad", "ingår", "beställningar", "våra", "vår", "vårt",
  "inte", "också", "bara", "mycket", "alltid", "aldrig",
  "skapa", "göra", "välja", "äta", "smaka",
];

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, " ") // strip HTML tags
    .replace(/&[a-z]+;/g, " ") // strip HTML entities
    .replace(/[^\p{L}\p{N}@.-]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function normalize(word: string): string {
  return word.toLowerCase().replace(/['’"().,!?:;\-]/g, "").replace(/s$/, "");
}

export function findEnglishLeaks(text: string): string[] {
  const tokens = tokenize(text).filter((t) => !ALLOWLIST.has(t));
  return Array.from(new Set(tokens.filter((t) => ENGLISH_STOPWORDS.includes(t))));
}

export function findSwedishLeaks(text: string): string[] {
  const tokens = tokenize(text).filter((t) => !ALLOWLIST.has(t));
  return Array.from(new Set(tokens.filter((t) => SWEDISH_STOPWORDS.includes(t))));
}

export function hasStraySwedishChars(text: string): boolean {
  const cleaned = text
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter((w) => {
      const n = normalize(w);
      return !ALLOWLIST.has(n) && !ALLOWLIST.has(n + "s");
    })
    .join(" ");
  return /[åäöÅÄÖ]/.test(cleaned);
}
