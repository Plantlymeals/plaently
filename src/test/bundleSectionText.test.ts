import { describe, it, expect } from "vitest";
import { useLangStore } from "@/lib/i18n";

// UI regression test: guards the bundle text rendered by BundleSection
// (via BUNDLE_META feature keys) against accidental i18n changes.
// If you intentionally reword these strings, update the expectations below.

const EXPECTED: Record<string, { sv: string; en: string }> = {
  "bundles.feat.mix4": {
    sv: "12 stycken Pasta Bolognese",
    en: "12 packs of Pasta Bolognese",
  },
  "bundles.feat.freeShipSe": {
    sv: "Fri frakt (Sverige)",
    en: "Free shipping (Sweden)",
  },
  "bundles.feat.delivered": {
    sv: "Levereras inom 1-2 dagar",
    en: "Delivered in 1-2 days",
  },
  "bundles.feat.monthlyMix": {
    sv: "Valfri mix varje månad",
    en: "Custom mix every month",
  },
  "bundles.feat.freeShipAlways": {
    sv: "Fri frakt (Sverige)",
    en: "Free shipping (Sweden)",
  },
  "bundles.feat.cancelAnytime": {
    sv: "Avsluta när som helst",
    en: "Cancel anytime",
  },
  "bundles.feat.priorityCs": {
    sv: "Prioriterad kundservice",
    en: "Priority customer service",
  },
  "bundles.whatsInside": {
    sv: "Vad ingår",
    en: "What's inside",
  },
  "bundles.orderNow": {
    sv: "Beställ nu",
    en: "Order now",
  },
};

function translate(lang: "sv" | "en", key: string): string {
  useLangStore.setState({ lang });
  return useLangStore.getState().t(key);
}

describe("BundleSection i18n text regression", () => {
  for (const [key, expected] of Object.entries(EXPECTED)) {
    it(`${key} renders the expected SV string`, () => {
      expect(translate("sv", key)).toBe(expected.sv);
    });
    it(`${key} renders the expected EN string`, () => {
      expect(translate("en", key)).toBe(expected.en);
    });
  }

  it("never contains the old 2-4 day delivery wording", () => {
    for (const lang of ["sv", "en"] as const) {
      const text = translate(lang, "bundles.feat.delivered");
      expect(text).not.toMatch(/2\s*[–-]\s*4/);
    }
  });

  it("never contains the old 'Välj din mix' wording", () => {
    expect(translate("sv", "bundles.feat.mix4")).not.toMatch(/Välj din/i);
    expect(translate("en", "bundles.feat.mix4")).not.toMatch(/Choose your/i);
  });
});