import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { useTranslation } from "@/lib/i18n";
import { Check, Loader2, Truck, Dumbbell, Sparkles } from "lucide-react";
import { useBundleMix } from "@/hooks/useBundleMix";
import { MixBuilderDialog } from "@/components/MixBuilderDialog";
import ShippingBadge from "@/components/ShippingBadge";
import SavingsBadge from "@/components/SavingsBadge";
import { useStarterOfferCount } from "@/hooks/useStarterOffer";

const StarterPackHighlight = () => {
  const [pack, setPack] = useState<ShopifyProduct | null>(null);
  const { t } = useTranslation();
  const { handleAdd, isLoading, dialogProps } = useBundleMix();
  const { remaining } = useStarterOfferCount();

  useEffect(() => {
    fetchShopifyProducts(10, "product_type:Bundle").then((data) => {
      if (!data) return;
      const starter = data.find((b) => b.node.title.toLowerCase().includes("starter")) || data[0];
      if (starter) setPack(starter);
    });
  }, []);

  if (!pack) return null;

  const variant = pack.node.variants.edges[0]?.node;
  const price = pack.node.priceRange.minVariantPrice;
  const bundlePrice = parseFloat(price.amount);

  const handleOrder = () => handleAdd(pack);

  const features = [
    { icon: Check, label: t("starter.meals") },
    { icon: Dumbbell, label: t("starter.protein") },
    { icon: Truck, label: t("starter.cookTime") },
  ];

  return (
    <section className="py-16 md:py-24 gradient-subtle">
      <div className="container">
        <div className="relative max-w-4xl mx-auto rounded-3xl bg-card border border-border/60 shadow-elevated p-8 md:p-12 animate-fade-up">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />{" "}
            {remaining !== null && remaining > 0 && t("offer.remaining").trim() !== ""
              ? t("offer.remaining").replace("{n}", String(remaining))
              : t("starter.badge")}
          </Badge>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <img
                src="/images/hero-product.webp"
                alt="PLÄNTLY Starter Pack – 12 koppar växtbaserade proteinmåltider med 20g protein per portion"
                className="w-full max-w-[280px] mx-auto md:mx-0 object-contain"
                width={280}
                height={157}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight">{t("starter.title")}</h2>
              <p className="text-muted-foreground text-lg">{t("starter.subtitle")}</p>
              <ul className="space-y-2.5">
                {features.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm md:text-base">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-medium">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-end gap-5 text-center md:text-right">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{t("starter.from")}</p>
                <p className="font-heading text-5xl md:text-6xl font-bold text-primary">
                  {parseFloat(price.amount).toFixed(0)} <span className="text-2xl font-semibold text-foreground">{price.currencyCode}</span>
                </p>
                <div className="mt-2 flex justify-center md:justify-end">
                  <SavingsBadge
                    title={pack.node.title}
                    bundlePrice={bundlePrice}
                    currencyCode={price.currencyCode}
                    showFullPrice
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <Button onClick={handleOrder} disabled={isLoading || !variant} size="lg" className="rounded-full px-10 font-semibold">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("starter.cta")}
                </Button>
                <Button asChild variant="ghost" className="rounded-full font-medium">
                  <Link to={`/product/${pack.node.handle}`}>{t("products.title")} →</Link>
                </Button>
                <ShippingBadge variant="muted" className="self-center md:self-end" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <MixBuilderDialog {...dialogProps} />
    </section>
  );
};

export default StarterPackHighlight;