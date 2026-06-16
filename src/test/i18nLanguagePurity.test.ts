import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import {
  findEnglishLeaks,
  findSwedishLeaks,
  hasStraySwedishChars,
} from "./languagePurity";

/**
 * Language purity check for the i18n dictionary.
 *
 * Fails the build when a Swedish translation contains obviously English
 * stopwords, or when an English translation contains obviously Swedish
 * stopwords / characters (å, ä, ö). Brand names, product names and shared
 * tokens are allow-listed.
 */

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
      const bad = findEnglishLeaks(e.sv);
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
      const bad = findSwedishLeaks(e.en);
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
      if (hasStraySwedishChars(e.en)) leaks.push(`${e.key}: "${e.en}"`);
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
