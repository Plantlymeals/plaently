import { describe, it, expect } from "vitest";
import { useLangStore } from "@/lib/i18n";

// UI regression test: guards the bundle text rendered by BundleSection
// (via BUNDLE_META feature keys) against accidental i18n changes.
// If you intentionally reword these strings, update the expectations below.

const EXPECTED: Record<string, { sv: string; en: string }> = {
  "bundles.feat.mix4": {
    sv: "Mix av alla 4 smaker",
    en: "Mix of all 4 flavors",
  },
  "bundles.feat.singleFlavor": {
    sv: "{count} stycken {name}",
    en: "{count} packs of {name}",
  },
  "bundles.feat.freeShipSe": {
    sv: "Fri frakt i Sverige",
    en: "Free shipping in Sweden",
  },
  "bundles.feat.delivered": {
    sv: "Levereras inom 2-4 vardagar",
    en: "Delivered in 2-4 business days",
  },
  "bundles.feat.monthlyMix": {
    sv: "Valfri mix varje månad",
    en: "Custom mix every month",
  },
  "bundles.feat.freeShipAlways": {
    sv: "Fri frakt i Sverige",
    en: "Free shipping in Sweden",
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

  it("keeps the corrected delivery wording", () => {
    expect(translate("sv", "bundles.feat.delivered")).toMatch(/vardagar/);
    expect(translate("en", "bundles.feat.delivered")).toMatch(/business days/);
  });

  it("never contains the old 'Välj din mix' wording", () => {
    expect(translate("sv", "bundles.feat.mix4")).not.toMatch(/Välj din/i);
    expect(translate("en", "bundles.feat.mix4")).not.toMatch(/Choose your/i);
  });
});