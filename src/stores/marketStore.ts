import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { detectMarket, MARKETS, type Market, type MarketConfig } from "@/lib/markets";

interface MarketStore {
  market: Market;
  hasUserOverride: boolean;
  setMarket: (m: Market) => void;
}

export const useMarketStore = create<MarketStore>()(
  persist(
    (set) => ({
      market: detectMarket(),
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

export const useMarketConfig = (): MarketConfig => {
  const market = useMarketStore((s) => s.market);
  return MARKETS[market];
};