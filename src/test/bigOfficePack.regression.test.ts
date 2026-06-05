import { describe, it, expect } from "vitest";
import { getBundleMealCount, getBundleSavings, SINGLE_MEAL_PRICE } from "@/lib/bundleSavings";
import { getBundleCupsFromTitle } from "@/hooks/useBundleMix";

/**
 * Regression guard for Big Office Pack.
 *
 * The price/cup count/savings shown in the UI (BundleSection + MealFinderQuiz)
 * MUST match the logic in `bundleSavings.ts`. If Shopify changes the price or
 * cup count, update BOTH the UI source-of-truth constants below AND the
 * bundle config in `BundleSection`, `MealFinderQuiz` and `useBundleMix`.
 */
const BIG_OFFICE = {
  title: "Big Office Pack",
  cups: 96,
  priceSEK: 2890,
} as const;

describe("Big Office Pack — UI vs bundleSavings regression", () => {
  it("cup count is consistent across bundleSavings and useBundleMix", () => {
    expect(getBundleMealCount(BIG_OFFICE.title)).toBe(BIG_OFFICE.cups);
    expect(getBundleCupsFromTitle(BIG_OFFICE.title)).toBe(BIG_OFFICE.cups);
  });

  it("'big office' is matched before 'office' (substring precedence)", () => {
    expect(getBundleMealCount("Big Office Pack")).toBe(96);
    expect(getBundleMealCount("Office Pack")).toBe(48);
  });

  it("savings amount matches cups × single price − bundle price", () => {
    const s = getBundleSavings(BIG_OFFICE.title, BIG_OFFICE.priceSEK);
    expect(s).not.toBeNull();
    expect(s!.mealCount).toBe(BIG_OFFICE.cups);
    expect(s!.fullPrice).toBe(BIG_OFFICE.cups * SINGLE_MEAL_PRICE);
    const expectedPct = Math.round(
      ((s!.fullPrice - BIG_OFFICE.priceSEK) / s!.fullPrice) * 100
    );
    expect(s!.savingsPercent).toBe(expectedPct);
  });

  it("absolute savings = 470 SEK at the locked price", () => {
    const s = getBundleSavings(BIG_OFFICE.title, BIG_OFFICE.priceSEK)!;
    expect(s.fullPrice - BIG_OFFICE.priceSEK).toBe(470);
  });

  it("per-cup price displayed in BundleSection rounds to 30 kr", () => {
    const perCup = Math.round(BIG_OFFICE.priceSEK / BIG_OFFICE.cups);
    expect(perCup).toBe(30);
  });
});