// Delad, ren filterlogik för produktlistan.
// Används av BÅDE klient-rendering (Products.tsx) och server-rendering
// (products.functions.ts loader + ItemList-JSON-LD). Detta är den ENDA
// implementationen — duplicera aldrig villkoren någon annanstans.

const BUNDLE_KEYS = ["big office", "office", "monthly", "athlete", "starter"] as const;
const CUPS: Record<string, number> = {
  starter: 12,
  athlete: 24,
  monthly: 24,
  office: 48,
  "big office": 96,
};

export function getBundleCupsFromTitle(title: string): number | null {
  const lower = title.toLowerCase();
  const key = BUNDLE_KEYS.find((k) => lower.includes(k));
  return key ? (CUPS[key] ?? null) : null;
}

/** Sant om produkten ska visas i /products-listan (paket/box/taster exkluderas). */
export function isListableProduct(title: string): boolean {
  const t = title.toLowerCase();
  return (
    !getBundleCupsFromTitle(t) &&
    !t.includes("taster") &&
    !t.includes("pack") &&
    !t.includes("box")
  );
}
