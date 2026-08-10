import { describe, it, expect } from "vitest";
import { LEGACY_REDIRECTS, resolveLegacyRedirect } from "@/lib/legacyRedirects";
import { LOCALE_PAIRS } from "@/lib/localeAlternates";

describe("legacy redirects", () => {
  it("folds legacy aliases into their primary URL", () => {
    expect(resolveLegacyRedirect("/om-oss")).toBe("/about");
    expect(resolveLegacyRedirect("/faqs")).toBe("/faq");
    expect(resolveLegacyRedirect("/blogg")).toBe("/blog");
    expect(resolveLegacyRedirect("/home")).toBe("/");
  });

  it("normalizes trailing slashes", () => {
    expect(resolveLegacyRedirect("/about/")).toBe("/about");
    expect(resolveLegacyRedirect("/")).toBeNull();
  });

  it("rewrites stale product handles and the legacy /products/:slug pattern", () => {
    expect(resolveLegacyRedirect("/product/office-pack-60-cups")).toBe("/product/office-pack-48-cups");
    expect(resolveLegacyRedirect("/products/monthly-box-24-cups")).toBe("/product/monthly-box-24-cups");
    expect(resolveLegacyRedirect("/product/monthly-box-24-cups")).toBeNull();
  });

  it("leaves primary pages untouched", () => {
    for (const path of ["/", "/products", "/about", "/faq", "/blog", "/nutrition"]) {
      expect(resolveLegacyRedirect(path)).toBeNull();
    }
  });

  it("never redirects a language variant away (hreflang pairs must stay indexable)", () => {
    for (const path of LOCALE_PAIRS.flat()) {
      expect(resolveLegacyRedirect(path)).toBeNull();
      expect(Object.values(LEGACY_REDIRECTS)).not.toContain(undefined);
    }
  });

  it("never targets a URL that is itself a redirect source", () => {
    for (const target of Object.values(LEGACY_REDIRECTS)) {
      expect(LEGACY_REDIRECTS[target]).toBeUndefined();
    }
  });
});
