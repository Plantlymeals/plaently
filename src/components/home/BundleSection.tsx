import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const SINGLE_MEAL_PRICE = 35; // SEK per single meal

const BUNDLE_MEAL_COUNTS: Record<string, number> = {
  starter: 12,
  athlete: 24,
  office: 60,
  "big office": 120,
};

function getMealCount(title: string): number | null {
  const lower = title.toLowerCase();
  for (const [key, count] of Object.entries(BUNDLE_MEAL_COUNTS)) {
    if (lower.includes(key)) return count;
  }
  return null;
}

const BundleSection = () => {
  const [bundles, setBundles] = useState<ShopifyProduct[]>([]);
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const { t } = useTranslation();

  const BUNDLE_BADGES: Record<string, string> = {
    "most-popular": t("bundles.mostPopular"),
    "best-value": t("bundles.bestValue"),
  };

  useEffect(() => {
    fetchShopifyProducts(10, "product_type:Bundle").then((data) => {
      if (data) setBundles(data);
    });
  }, []);

  if (bundles.length === 0) return null;

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(t("products.addedToCart"), { position: "top-center" });
  };

  const getBadge = (product: ShopifyProduct) => {
    const tags = (product.node as any).tags || [];
    for (const [tag, label] of Object.entries(BUNDLE_BADGES)) {
      if (typeof tags === "string" ? tags.includes(tag) : Array.isArray(tags) && tags.includes(tag)) {
        return label;
      }
    }
    return null;
  };

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">{t("bundles.title")}</h2>
          <p className="text-muted-foreground text-lg">{t("bundles.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bundles.map((b) => {
            const price = b.node.priceRange.minVariantPrice;
            const badge = getBadge(b);
            const bundlePrice = parseFloat(price.amount);
            const mealCount = getMealCount(b.node.title);
            const perMeal = mealCount ? bundlePrice / mealCount : null;
            const fullPrice = mealCount ? mealCount * SINGLE_MEAL_PRICE : null;
            const savingsPercent = fullPrice ? Math.round(((fullPrice - bundlePrice) / fullPrice) * 100) : null;

            return (
              <div key={b.node.id} className="relative rounded-2xl bg-card border border-border/50 p-6 shadow-card text-center space-y-4 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-up">
                {badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold">{badge}</Badge>
                )}
                <h3 className="font-heading text-lg font-semibold pt-2">{b.node.title}</h3>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-primary">{price.currencyCode} {bundlePrice.toFixed(0)}</p>
                  {fullPrice && savingsPercent && savingsPercent > 0 && (
                    <p className="text-xs text-muted-foreground line-through">
                      {price.currencyCode} {fullPrice}
                    </p>
                  )}
                  {perMeal && (
                    <p className="text-sm font-medium text-muted-foreground">
                      {perMeal.toFixed(0)} {price.currencyCode} / {t("products.perMeal")}
                    </p>
                  )}
                  {savingsPercent !== null && savingsPercent > 0 && (
                    <span className="inline-block mt-1 text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-0.5">
                      {t("bundles.save")} {savingsPercent}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{b.node.description}</p>
                <Button onClick={() => handleAddToCart(b)} disabled={isLoading} className="w-full rounded-full font-semibold">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("bundles.orderNow")}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BundleSection;
