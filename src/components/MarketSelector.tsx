import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMarketStore } from "@/stores/marketStore";
import { MARKETS, marketLabel, type Market } from "@/lib/markets";
import { useTranslation } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";

interface Props {
  variant?: "header" | "footer";
}

export const MarketSelector = ({ variant = "header" }: Props) => {
  const market = useMarketStore((s) => s.market);
  const setMarket = useMarketStore((s) => s.setMarket);
  const { lang, t } = useTranslation();
  const current = MARKETS[market];

  const trigger =
    variant === "header" ? (
      <button
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold border border-border/50 hover:bg-muted transition-colors shrink-0"
        aria-label={t("market.changeCountry")}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{market}</span>
        <ChevronDown className="h-3 w-3 hidden sm:block" />
      </button>
    ) : (
      <button
        className="flex items-center gap-2 text-xs text-primary-foreground/70 hover:text-primary transition-colors"
        aria-label={t("market.changeCountry")}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span>{marketLabel(market, lang)}</span>
        <ChevronDown className="h-3 w-3" />
      </button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {(Object.keys(MARKETS) as Market[]).map((m) => (
          <DropdownMenuItem
            key={m}
            onClick={() => setMarket(m)}
            className={market === m ? "font-semibold text-primary" : ""}
          >
            <span className="mr-2 text-base">{MARKETS[m].flag}</span>
            {marketLabel(m, lang)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MarketSelector;