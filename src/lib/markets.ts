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

const TZ_TO_MARKET: Record<string, Market> = {
  "Europe/Stockholm": "SE",
  "Europe/London": "UK",
};

/**
 * Best-effort market detection on the client.
 * No network call, no GDPR cookie required.
 */
export function detectMarket(): Market {
  if (typeof window === "undefined") return "SE";
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TZ_TO_MARKET[tz]) return TZ_TO_MARKET[tz];
    if (tz && tz.startsWith("Europe/")) {
      // Default any other European tz to EU
      return "EU";
    }
    const lang = navigator.language?.toLowerCase() ?? "";
    if (lang.startsWith("sv")) return "SE";
    if (lang.includes("-gb") || lang === "en-uk") return "UK";
    const region = lang.split("-")[1]?.toUpperCase();
    if (region === "SE") return "SE";
    if (region === "GB" || region === "UK") return "UK";
    if (region && EU_COUNTRIES.has(region)) return "EU";
  } catch {
    // ignore
  }
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