import { describe, it } from "vitest";
import {
  findEnglishLeaks,
  findSwedishLeaks,
  hasStraySwedishChars,
} from "./languagePurity";

/**
 * Language-purity check for dynamically loaded CMS content:
 *   - blog_posts (per-row `language` column: 'sv' | 'en')
 *   - faqs       (paired columns: question/answer = EN, *_sv = SV)
 *   - products   (single-language; only checks non-empty name/description)
 *
 * Fetches published rows directly from the public Data API using the anon
 * key, mirroring what the storefront actually renders. The test is skipped
 * cleanly if the network or env is unavailable so it never breaks offline
 * builds.
 */

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? "https://fpwwjbevjhxbggtkaabc.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwd3dqYmV2amh4YmdndGthYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTA5NzAsImV4cCI6MjA4ODUyNjk3MH0.gc-lfNODgXF7_nzAtxJxI7zc_S42BmoWSkskpIsKvHw";

const FETCH_TIMEOUT_MS = 8000;

async function rest<T>(path: string): Promise<T[] | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

type BlogRow = { slug: string; language: string; title: string | null; excerpt: string | null; content: string | null };
type FaqRow = { id: string; question: string | null; answer: string | null; question_sv: string | null; answer_sv: string | null };
type ProductRow = { slug: string; name: string | null; description: string | null };

function reportLeaks(label: string, leaks: string[]) {
  if (leaks.length) {
    throw new Error(`${label}:\n  ${leaks.join("\n  ")}`);
  }
}

describe("CMS language purity", () => {
  it("blog_posts: SV rows contain no English, EN rows contain no Swedish", async () => {
    const rows = await rest<BlogRow>(
      "blog_posts?select=slug,language,title,excerpt,content&is_published=eq.true",
    );
    if (!rows) return; // network/env unavailable — skip silently

    const leaks: string[] = [];
    for (const r of rows) {
      const fields = [
        ["title", r.title],
        ["excerpt", r.excerpt],
        ["content", r.content],
      ] as const;
      for (const [name, value] of fields) {
        if (!value) continue;
        if (r.language === "sv") {
          const bad = findEnglishLeaks(value);
          if (bad.length) leaks.push(`[sv] ${r.slug}.${name} → [${bad.join(", ")}]`);
        } else if (r.language === "en") {
          const bad = findSwedishLeaks(value);
          if (bad.length) leaks.push(`[en] ${r.slug}.${name} → [${bad.join(", ")}]`);
          if (hasStraySwedishChars(value)) leaks.push(`[en] ${r.slug}.${name} → stray å/ä/ö`);
        }
      }
    }
    reportLeaks("Blog post language leaks", leaks);
  });

  it("faqs: question/answer (EN) and *_sv columns stay in their language", async () => {
    const rows = await rest<FaqRow>(
      "faqs?select=id,question,answer,question_sv,answer_sv&is_published=eq.true",
    );
    if (!rows) return;

    const leaks: string[] = [];
    for (const r of rows) {
      const en = [
        ["question", r.question],
        ["answer", r.answer],
      ] as const;
      const sv = [
        ["question_sv", r.question_sv],
        ["answer_sv", r.answer_sv],
      ] as const;

      for (const [name, value] of en) {
        if (!value) continue;
        const bad = findSwedishLeaks(value);
        if (bad.length) leaks.push(`[en] faq ${r.id}.${name} → [${bad.join(", ")}]`);
        if (hasStraySwedishChars(value)) leaks.push(`[en] faq ${r.id}.${name} → stray å/ä/ö`);
      }
      for (const [name, value] of sv) {
        if (!value) continue;
        const bad = findEnglishLeaks(value);
        if (bad.length) leaks.push(`[sv] faq ${r.id}.${name} → [${bad.join(", ")}]`);
      }
    }
    reportLeaks("FAQ language leaks", leaks);
  });

  it("products: published rows have non-empty name and description", async () => {
    const rows = await rest<ProductRow>(
      "products?select=slug,name,description&is_published=eq.true",
    );
    if (!rows) return;

    const missing = rows
      .filter((r) => !r.name?.trim() || !r.description?.trim())
      .map((r) => r.slug);
    reportLeaks(
      "Products missing name/description (cannot validate language)",
      missing,
    );
  });
});
