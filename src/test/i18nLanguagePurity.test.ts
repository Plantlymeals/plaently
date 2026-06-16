import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Language purity check for the i18n dictionary.
 *
 * Fails the build when a Swedish translation contains obviously English
 * stopwords, or when an English translation contains obviously Swedish
 * stopwords / characters (å, ä, ö). Brand names, product names and shared
 * tokens are allow-listed.
 */

const ALLOWLIST = new Set([
  // Brand & company
  "pläntly", "plantly", "plaently", "se559400472201",
  "vretensborgsvägen", "hägersten", "hello@plaently.com",
  // Product / pack names (kept identical in both languages)
  "starter", "pack", "monthly", "box", "office", "big",
  "fusilli", "bolognese", "pasta", "carbonara", "smoky",
  "bbq", "lentils", "yellow", "curry", "rice",
  // Shared abbreviations / units
  "faq", "20g", "5", "min", "kr", "sek", "eu", "ai",
  "linkedin", "instagram", "tiktok", "facebook",
]);

// Words that strongly indicate English text. Used to detect leakage into SV.
const ENGLISH_STOPWORDS = [
  "the", "and", "with", "your", "you", "our", "for", "from",
  "this", "that", "what", "when", "how", "why", "ready",
  "shop", "now", "meals", "meal", "healthy", "plant-based",
  "shipping", "free", "subscribe", "subscription", "about",
  "contact", "home", "nutrition", "lifestyle", "blog",
  "products", "discover", "learn", "more", "join", "today",
  "available", "delivered", "minutes", "protein",
];

// Words that strongly indicate Swedish text. Used to detect leakage into EN.
const SWEDISH_STOPWORDS = [
  "och", "eller", "men", "att", "som", "med", "för", "från",
  "den", "det", "är", "var", "vad", "när", "hur", "varför",
  "handla", "köp", "måltid", "måltider", "frakt", "fri",
  "näring", "livsstil", "produkter", "hem", "kontakt",
  "klart", "minuter", "hälsosam", "hälsosamma", "plantbaserad",
  "plantbaserat", "prenumerera", "prenumeration", "erbjudande",
  "tillagad", "ingår", "vad ingår", "beställningar", "nu",
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}@.-]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function parseDict(): { key: string; sv: string; en: string }[] {
  const src = readFileSync(resolve(__dirname, "../lib/i18n.ts"), "utf8");
  // Match: "key": { sv: "...", en: "..." }
  const re = /"([^"]+)"\s*:\s*\{\s*sv:\s*"((?:[^"\\]|\\.)*)"\s*,\s*en:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
  const out: { key: string; sv: string; en: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    out.push({
      key: m[1],
      sv: m[2].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
      en: m[3].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
    });
  }
  return out;
}

const entries = parseDict();

describe("i18n language purity", () => {
  it("loads a non-trivial dictionary", () => {
    expect(entries.length).toBeGreaterThan(50);
  });

  it("has no English stopwords inside Swedish translations", () => {
    const leaks: string[] = [];
    for (const e of entries) {
      const tokens = tokenize(e.sv).filter((t) => !ALLOWLIST.has(t));
      const bad = tokens.filter((t) => ENGLISH_STOPWORDS.includes(t));
      if (bad.length) leaks.push(`${e.key}: "${e.sv}" → [${bad.join(", ")}]`);
    }
    if (leaks.length) {
      throw new Error(
        `English words found in Swedish translations:\n  ${leaks.join("\n  ")}`,
      );
    }
  });

  it("has no Swedish stopwords inside English translations", () => {
    const leaks: string[] = [];
    for (const e of entries) {
      const tokens = tokenize(e.en).filter((t) => !ALLOWLIST.has(t));
      const bad = tokens.filter((t) => SWEDISH_STOPWORDS.includes(t));
      if (bad.length) leaks.push(`${e.key}: "${e.en}" → [${bad.join(", ")}]`);
    }
    if (leaks.length) {
      throw new Error(
        `Swedish words found in English translations:\n  ${leaks.join("\n  ")}`,
      );
    }
  });

  it("has no å/ä/ö characters inside English translations", () => {
    const leaks: string[] = [];
    for (const e of entries) {
      // Strip allow-listed tokens (brand names like PLÄNTLY) before scanning.
      const cleaned = e.en
        .split(/\s+/)
        .filter((w) => !ALLOWLIST.has(w.toLowerCase().replace(/[.,!?:;]/g, "")))
        .join(" ");
      if (/[åäöÅÄÖ]/.test(cleaned)) {
        leaks.push(`${e.key}: "${e.en}"`);
      }
    }
    if (leaks.length) {
      throw new Error(
        `Swedish characters found in English translations:\n  ${leaks.join("\n  ")}`,
      );
    }
  });

  it("has no empty translations on either side", () => {
    const empties = entries.filter((e) => !e.sv.trim() || !e.en.trim());
    if (empties.length) {
      throw new Error(
        `Empty translations: ${empties.map((e) => e.key).join(", ")}`,
      );
    }
  });
});
