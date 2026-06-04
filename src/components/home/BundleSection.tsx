import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchShopifyProducts, type ShopifyProduct, cleanProductTitle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Check, Loader2, Star, Heart } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { MixBuilderDialog } from "@/components/MixBuilderDialog";

const SINGLE_MEAL_PRICE = 35; // SEK per single meal

type BundleKey = "starter" | "athlete" | "monthly" | "office" | "big office";

// Order matters: "big office" must come before "office" to avoid partial match.
const BUNDLE_KEYS: BundleKey[] = ["big office", "office", "monthly", "athlete", "starter"];

function matchBundleKey(title: string): BundleKey | null {
  const lower = title.toLowerCase();
  return BUNDLE_KEYS.find((k) => lower.includes(k)) ?? null;
}

const BUNDLE_META: Record<BundleKey, {
  cups: number;
  subtitleKey?: string;
  features: string[];
  highlight: "trial" | "popular" | "value" | "subscription";
  freeShipping: boolean;
}> = {
  starter:      { cups: 12,  features: ["bundles.feat.mix4", "bundles.feat.freeShipSe", "bundles.feat.delivered"], highlight: "popular", freeShipping: true },
  athlete:      { cups: 24,  features: ["bundles.feat.mix4", "bundles.feat.freeShipSe", "bundles.feat.delivered"], highlight: "popular", freeShipping: true },
  monthly:      { cups: 24,  features: ["bundles.feat.monthlyMix", "bundles.feat.freeShipAlways", "bundles.feat.cancelAnytime", "bundles.feat.priorityCs"], highlight: "subscription", freeShipping: true },
  office:       { cups: 48,  features: ["bundles.feat.monthlyMix", "bundles.feat.freeShipAlways", "bundles.feat.cancelAnytime", "bundles.feat.priorityCs"], highlight: "value", freeShipping: true },
  "big office": { cups: 120, features: ["bundles.feat.monthlyMix", "bundles.feat.freeShipAlways", "bundles.feat.cancelAnytime", "bundles.feat.priorityCs"], highlight: "value", freeShipping: true },
};

const SUBTITLE_KEYS: Record<BundleKey, string> = {
  starter: "bundles.desc.starter",
  athlete: "bundles.desc.athlete",
  monthly: "bundles.desc.office",
  office: "bundles.desc.office",
  "big office": "bundles.desc.bigoffice",
};

const BundleSection = () => {
  const [bundles, setBundles] = useState<ShopifyProduct[]>([]);
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const { t } = useTranslation();
  const [mixOpen, setMixOpen] = useState(false);
  const [activeBundle, setActiveBundle] = useState<ShopifyProduct | null>(null);
  const [activeBundleCups, setActiveBundleCups] = useState<number>(0);

  useEffect(() => {
    fetchShopifyProducts(10, "product_type:Bundle").then((data) => {
      if (data) {
        const filtered = data.filter((b) => !b.node.title.toLowerCase().includes("taster"));
        const sorted = [...filtered].sort(
          (a, b) =>
            parseFloat(a.node.priceRange.minVariantPrice.amount) -
            parseFloat(b.node.priceRange.minVariantPrice.amount)
        );
        setBundles(sorted);
      }
    });
  }, []);

  if (bundles.length === 0) return null;

  const handleAddToCart = async (product: ShopifyProduct) => {
    return handleAddToCartWithAttrs(product, undefined);
  };

  const handleAddToCartWithAttrs = async (
    product: ShopifyProduct,
    attributes: Array<{ key: string; value: string }> | undefined
  ) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
      attributes,
    });
    toast.success(t("products.addedToCart"), { position: "top-center" });
  };

  const openMixFor = (product: ShopifyProduct, cups: number) => {
    setActiveBundle(product);
    setActiveBundleCups(cups);
    setMixOpen(true);
  };

  const handleMixConfirm = async (attributes: Array<{ key: string; value: string }>) => {
    if (!activeBundle) return;
    await handleAddToCartWithAttrs(activeBundle, attributes);
    setMixOpen(false);
    setActiveBundle(null);
  };

  return (
    <section className="py-20 md:py-28 bg-[#0a0a0a] text-white">
      <div className="container space-y-14">
        <div className="text-center space-y-3 animate-fade-up">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Bundles</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold leading-tight">{t("bundles.title")}</h2>
          <p className="text-white/80 text-base md:text-lg">{t("bundles.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {bundles.map((b) => {
            const price = b.node.priceRange.minVariantPrice;
            const bundlePrice = parseFloat(price.amount);
            const key = matchBundleKey(b.node.title);
            const meta = key ? BUNDLE_META[key] : null;
            const cups = meta?.cups ?? null;
            const perCup = cups ? bundlePrice / cups : null;
            const fullPrice = cups ? cups * SINGLE_MEAL_PRICE : null;
            const savings = fullPrice && fullPrice > bundlePrice ? Math.round(fullPrice - bundlePrice) : 0;
            const subtitleKey = key ? SUBTITLE_KEYS[key] : null;
            const isPopular = meta?.highlight === "popular";
            const isValue = meta?.highlight === "value";
            const isTrial = meta?.highlight === "trial";
            const isSubscription = meta?.highlight === "subscription";

            return (
              <div
                key={b.node.id}
                className="relative rounded-3xl bg-[#1a1a1a] border border-white/10 p-7 md:p-8 animate-fade-up hover:border-primary/40 transition-colors flex flex-col"
              >
                {/* Top badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {isTrial && (
                    <span className="rounded-full border border-white/20 text-[10px] font-bold tracking-widest uppercase py-[5px] px-[6px]">
                      {t("bundles.tryFirst")}
                    </span>
                  )}
                  {isPopular && (
                    <span className="rounded-full bg-primary py-1 text-[10px] font-bold tracking-widest uppercase text-primary-foreground px-[8px]">
                      {t("bundles.mostPopular")}
                    </span>
                  )}
                  {isValue && (
                    <span className="rounded-full border border-white/20 text-[10px] font-bold tracking-widest uppercase py-[5px] px-[6px]">
                      {t("bundles.bestValue")}
                    </span>
                  )}
                  {isSubscription && (
                    <span className="rounded-full border border-white/20 text-[10px] font-bold tracking-widest uppercase py-[5px] px-[6px]">
                      {t("bundles.subSave")}
                    </span>
                  )}
                  {bundlePrice >= 499 && (
                    <span className="rounded-full border border-white/20 text-[10px] font-bold tracking-widest uppercase py-[5px] px-[6px]">
                      {t("bundles.freeShipping")}
                    </span>
                  )}
                </div>

                {/* Title + subtitle */}
                <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">{b.node.title}</h3>
                {cups && (
                  <p className="text-sm text-white/75 mb-6">
                    {cups} {t("bundles.cups")}
                  </p>
                )}

                {/* Price block */}
                <div className="mb-5">
                  <p className="font-heading text-5xl md:text-6xl font-bold leading-none">
                    {bundlePrice.toFixed(0)} <span className="text-2xl font-bold align-top">{price.currencyCode}</span>
                  </p>
                  {perCup && (
                    <p className="text-sm text-white/80 mt-3">
                      {perCup.toFixed(0)} {t("bundles.perCup")}
                    </p>
                  )}
                </div>

                {/* Savings strip */}
                {savings > 0 && (
                  <div className="mb-5">
                    {isTrial ? (
                      <p className="text-sm text-white/70 line-through">
                        {t("bundles.value")} {fullPrice} {price.currencyCode}
                      </p>
                    ) : isValue || isSubscription ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 text-xs font-semibold">
                        <Star className="h-3.5 w-3.5 fill-amber-300" /> {t("bundles.save")} {savings} {price.currencyCode}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary px-3 py-1 text-xs font-semibold">
                        <Heart className="h-3.5 w-3.5 fill-primary" /> {t("bundles.youSave")} {savings} {price.currencyCode}
                      </span>
                    )}
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {(meta?.features ?? []).map((fk) => (
                    <li key={fk} className="flex items-start gap-2.5 text-sm text-white/85">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{t(fk)}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => (cups && cups > 1 ? openMixFor(b, cups) : handleAddToCart(b))}
                  disabled={isLoading}
                  className={`w-full rounded-full font-semibold h-12 text-base ${
                    isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                  }`}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("bundles.orderNow")}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <MixBuilderDialog
        open={mixOpen}
        onOpenChange={(o) => {
          setMixOpen(o);
          if (!o) setActiveBundle(null);
        }}
        bundleTitle={activeBundle?.node.title || ""}
        totalCups={activeBundleCups}
        isLoading={isLoading}
        onConfirm={handleMixConfirm}
      />
    </section>
  );
};

export default BundleSection;
