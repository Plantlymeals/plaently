import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useRouteContext } from "@tanstack/react-router";
import { MARKETS, type Market, type MarketConfig } from "@/lib/markets";

interface MarketStore {
  market: Market;
  hasUserOverride: boolean;
  setMarket: (m: Market) => void;
}

export const useMarketStore = create<MarketStore>()(
  persist(
    (set) => ({
      market: "SE",
      hasUserOverride: false,
      setMarket: (m) => set({ market: m, hasUserOverride: true }),
    }),
    {
      name: "plantely-market",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ market: s.market, hasUserOverride: s.hasUserOverride }),
    }
  )
);

/**
 * The market that actually applies right now:
 * a manual choice always wins, otherwise the SSR-resolved geo market.
 */
export const useEffectiveMarket = (): Market => {
  const geoMarket = useRouteContext({
    from: "__root__",
    select: (c: { geoMarket?: Market }) => c.geoMarket,
  });
  const market = useMarketStore((s) => s.market);
  const hasUserOverride = useMarketStore((s) => s.hasUserOverride);
  return hasUserOverride ? market : (geoMarket ?? "SE");
};

export const useMarketConfig = (): MarketConfig => MARKETS[useEffectiveMarket()];
