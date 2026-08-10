/**
 * CI guard: every page must render exactly one self-referencing canonical and a
 * reciprocal sv/en/x-default hreflang set, so Google Search Console treats the
 * Swedish and English URLs as language alternates instead of duplicates.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { render, waitFor, cleanup } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { LOCALE_PAIRS, getAlternates, getLocalePair, normalizePath } from "@/lib/localeAlternates";

const BASE_URL = "https://plaently.com";

/** Every indexable path we ship, including both sides of each language pair. */
const PATHS = [
  "/",
  "/products",
  "/nutrition",
  "/lifestyle",
  "/about",
  "/faq",
  "/contact",
  "/blog",
  ...LOCALE_PAIRS.flat(),
];

const renderHead = async (path: string) => {
  document.head.querySelectorAll("link[rel=canonical],link[rel=alternate]").forEach((n) => n.remove());
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <SEOHead title="t" description="d" path={path} />
      </MemoryRouter>
    </HelmetProvider>,
  );
  await waitFor(() => {
    expect(document.head.querySelector("link[rel=canonical]")).toBeTruthy();
  });
  return {
    canonicals: Array.from(document.head.querySelectorAll<HTMLLinkElement>("link[rel=canonical]")).map((l) => l.href),
    alternates: Array.from(document.head.querySelectorAll<HTMLLinkElement>("link[rel=alternate]")).map((l) => ({
      hreflang: l.hreflang,
      href: l.href,
    })),
  };
};

describe("canonical + hreflang", () => {
  beforeEach(() => {
    cleanup();
    document.head.querySelectorAll("link[rel=canonical],link[rel=alternate]").forEach((n) => n.remove());
  });

  it.each(PATHS)("%s renders exactly one self-referencing canonical", async (path) => {
    const { canonicals } = await renderHead(path);
    expect(canonicals).toHaveLength(1);
    expect(canonicals[0]).toBe(`${BASE_URL}${normalizePath(path)}`);
  });

  it.each(PATHS)("%s renders a complete sv/en/x-default hreflang set", async (path) => {
    const { alternates } = await renderHead(path);
    const langs = alternates.map((a) => a.hreflang).sort();
    expect(langs).toEqual(["en", "sv", "x-default"]);
    // No duplicate hreflang values (a second x-default confuses Google).
    expect(new Set(langs).size).toBe(langs.length);
  });

  it.each(LOCALE_PAIRS)("pair %s / %s points at each other reciprocally", async (sv, en) => {
    for (const path of [sv, en]) {
      const { alternates, canonicals } = await renderHead(path);
      const byLang = Object.fromEntries(alternates.map((a) => [a.hreflang, a.href]));
      expect(byLang.sv).toBe(`${BASE_URL}${sv}`);
      expect(byLang.en).toBe(`${BASE_URL}${en}`);
      expect(byLang["x-default"]).toBe(`${BASE_URL}${en}`);
      // Canonical must stay on the visited URL, never cross over to the other language.
      expect(canonicals[0]).toBe(`${BASE_URL}${path}`);
    }
  });

  it("declares both languages for single-URL pages", () => {
    expect(getLocalePair("/about")).toBeNull();
    expect(getAlternates("/about")).toEqual([
      { hreflang: "sv", path: "/about" },
      { hreflang: "en", path: "/about" },
      { hreflang: "x-default", path: "/about" },
    ]);
  });

  it("has no conflicting static canonical/hreflang in index.html", () => {
    const html = readFileSync(resolve("index.html"), "utf-8");
    expect(html).not.toMatch(/<link[^>]+rel=["']canonical["']/i);
    expect(html).not.toMatch(/<link[^>]+rel=["']alternate["'][^>]*hreflang/i);
  });

  it("keeps both language URLs of every pair in the sitemap", () => {
    const xml = readFileSync(resolve("public/sitemap.xml"), "utf-8");
    for (const path of LOCALE_PAIRS.flat()) {
      expect(xml).toContain(`<loc>${BASE_URL}${path}</loc>`);
    }
  });
});
