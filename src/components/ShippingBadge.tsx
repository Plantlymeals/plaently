import { Truck } from "lucide-react";
import { useMarketConfig } from "@/stores/marketStore";
import { useTranslation } from "@/lib/i18n";
import { marketLabel } from "@/lib/markets";

interface Props {
  variant?: "light" | "dark" | "muted";
  className?: string;
}

/**
 * Visar "Fri frakt från X kr i {marknad}" baserat på vald marknad.
 */
export const ShippingBadge = ({ variant = "muted", className = "" }: Props) => {
  const cfg = useMarketConfig();
  const { t, lang } = useTranslation();
  const text = t("shipping.freeOver")
    .replace("{amount}", String(cfg.freeShippingThreshold))
    .replace("{currency}", cfg.currency)
    .replace("{market}", marketLabel(cfg.code, lang));

  const styles =
    variant === "light"
      ? "bg-background/15 border-background/30 text-primary-foreground"
      : variant === "dark"
      ? "bg-white/10 border-white/15 text-white"
      : "bg-primary/10 border-primary/25 text-primary";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${styles} ${className}`}
    >
      <Truck className="h-3.5 w-3.5" />
      <span>{cfg.flag} {text}</span>
    </span>
  );
};

export default ShippingBadge;