export type Market = "SE" | "EU" | "UK";

export interface MarketConfig {
  code: Market;
  flag: string;
  currency: "SEK" | "GBP" | "EUR";
  shippingCost: number;
  freeShippingThreshold: number;
  /** Internal threshold in SEK for comparing against Shopify cart totals. */
  freeShippingThresholdSek: number;
}

export const MARKETS: Record<Market, MarketConfig> = {
  SE: { code: "SE", flag: "🇸🇪", currency: "SEK", shippingCost: 49, freeShippingThreshold: 399, freeShippingThresholdSek: 399 },
  EU: { code: "EU", flag: "🇪🇺", currency: "EUR", shippingCost: 6, freeShippingThreshold: 55, freeShippingThresholdSek: 599 },
  UK: { code: "UK", flag: "🇬🇧", currency: "SEK", shippingCost: 79, freeShippingThreshold: 699, freeShippingThresholdSek: 699 },
};

// EU member-state ISO codes (excl. SE, UK)
const EU_COUNTRIES = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
  "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES",
]);

/**
 * Map an edge geo country code (e.g. "SE", "GB", "DE") to a market.
 * Pure — safe on both server and client.
 */
export function marketFromCountry(country: string | null | undefined): Market {
  const c = (country ?? "").toUpperCase();
  if (!c) return "SE";
  if (c === "SE") return "SE";
  if (c === "GB" || c === "UK") return "UK";
  if (EU_COUNTRIES.has(c)) return "EU";
  return "SE";
}


export function marketLabel(market: Market, lang: "sv" | "en"): string {
  const map: Record<Market, { sv: string; en: string }> = {
    SE: { sv: "Sverige", en: "Sweden" },
    EU: { sv: "EU", en: "EU" },
    UK: { sv: "Storbritannien", en: "United Kingdom" },
  };
  return map[market][lang];
}