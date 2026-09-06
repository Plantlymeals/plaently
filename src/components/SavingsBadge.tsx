import { Star, Heart } from "lucide-react";
import { getBundleSavings } from "@/lib/bundleSavings";
import { useTranslation, tLocale, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type SavingsBadgeVariant = "primary" | "default" | "value" | "trial";

interface SavingsBadgeProps {
  title: string;
  bundlePrice: number;
  currencyCode: string;
  variant?: SavingsBadgeVariant;
  /** Show the line-through full price next to the chip. */
  showFullPrice?: boolean;
  /** Optional size token for the chip text. */
  size?: "xs" | "sm";
  className?: string;
  fullPriceClassName?: string;
}

/**
 * Unified "Spara" savings badge. All product/bundle surfaces should render
 * this component so the savings calculation and formatting stay in sync.
 *
 * Renders nothing when the bundle has no qualifying savings.
 */
const SavingsBadge = ({
  title,
  bundlePrice,
  currencyCode,
  variant = "primary",
  showFullPrice = false,
  size = "xs",
  className,
  fullPriceClassName,
  locale,
}: SavingsBadgeProps) => {
  const { t: globalT } = useTranslation();
  const t = locale ? (key: string) => tLocale(key, locale) : globalT;
  const savings = getBundleSavings(title, bundlePrice);
  if (!savings || savings.savingsAmount <= 0) return null;

  const fullPriceText = `${savings.fullPrice.toFixed(0)} ${currencyCode}`;
  const chipText = `${t(variant === "default" ? "bundles.youSave" : "bundles.save")} ${savings.savingsAmount} ${currencyCode} · ${savings.savingsPercent}%`;

  if (variant === "trial") {
    return (
      <span className={cn("text-sm text-muted-foreground line-through", fullPriceClassName, className)}>
        {t("bundles.value")} {fullPriceText}
      </span>
    );
  }

  const chipSize = size === "sm" ? "text-sm px-3 py-1" : "text-xs px-3 py-0.5";
  const chipStyle =
    variant === "value"
      ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
      : "bg-primary/10 text-primary";

  const icon =
    variant === "value" ? (
      <Star className="h-3.5 w-3.5 fill-amber-300" />
    ) : variant === "default" ? (
      <Heart className="h-3.5 w-3.5 fill-primary" />
    ) : null;

  const chip = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        chipSize,
        chipStyle,
        className,
      )}
    >
      {icon}
      {chipText}
    </span>
  );

  if (!showFullPrice) return chip;

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className={cn("text-sm text-muted-foreground line-through", fullPriceClassName)}>
        {fullPriceText}
      </span>
      {chip}
    </span>
  );
};

export default SavingsBadge;