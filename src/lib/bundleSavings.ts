export const SINGLE_MEAL_PRICE = 39;

// Order matters: "big office" must come before "office" to avoid partial match.
const BUNDLE_MEAL_COUNTS: [string, number][] = [
  ["big office", 96],
  ["office", 48],
  ["athlete", 24],
  ["monthly", 24],
  ["starter", 12],
];

export function getBundleMealCount(title: string): number | null {
  const lower = title.toLowerCase();
  for (const [key, count] of BUNDLE_MEAL_COUNTS) {
    if (lower.includes(key)) return count;
  }
  return null;
}

export function getBundleSavings(title: string, bundlePrice: number) {
  const mealCount = getBundleMealCount(title);
  if (!mealCount) return null;
  const fullPrice = mealCount * SINGLE_MEAL_PRICE;
  if (fullPrice <= bundlePrice) {
    return { mealCount, fullPrice, savingsAmount: 0, savingsPercent: 0 };
  }
  const savingsAmount = Math.round(fullPrice - bundlePrice);
  const savingsPercent = Math.round(((fullPrice - bundlePrice) / fullPrice) * 100);
  return { mealCount, fullPrice, savingsAmount, savingsPercent };
}

// Per-meal pricing for single-flavour boxes (12 cups each). Kept separate from
// BUNDLE_MEAL_COUNTS so these products never trigger the savings badge.
const BOX_MEAL_COUNTS: [string, number][] = [
  ["smoky lentils", 12],
  ["yellow curry", 12],
  ["bolognese", 12],
  ["carbonara", 12],
];

export function getPerMealInfo(
  title: string,
  bundlePrice: number
): { mealCount: number; perMeal: number } | null {
  const lower = title.toLowerCase();
  for (const [key, count] of BOX_MEAL_COUNTS) {
    if (lower.includes(key)) {
      return { mealCount: count, perMeal: Math.round(bundlePrice / count) };
    }
  }
  return null;
}