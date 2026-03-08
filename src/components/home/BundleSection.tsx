import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

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
            return (
              <div key={b.node.id} className="relative rounded-2xl bg-card border border-border/50 p-6 shadow-card text-center space-y-4 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-up">
                {badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold">{badge}</Badge>
                )}
                <h3 className="font-heading text-lg font-semibold pt-2">{b.node.title}</h3>
                <p className="text-3xl font-bold text-primary">{price.currencyCode} {parseFloat(price.amount).toFixed(0)}</p>
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
