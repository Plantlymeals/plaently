import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { MixBuilderDialog } from "@/components/MixBuilderDialog";
import { fetchPublishedBundles, type BundleRow } from "@/lib/bundlesApi";
import { SINGLE_MEAL_PRICE } from "@/lib/bundleSavings";
import SavingsBadge from "@/components/SavingsBadge";
import { useMarketConfig } from "@/stores/marketStore";
import { marketLabel } from "@/lib/markets";
import { displayProductTitle } from "@/lib/productImages";
// Optimised WebP variants of the mixed-bundle photo (same image, smaller bytes).
const BUNDLE_MIX_SRC = "/images/bundles/paket-mix-4-smaker-960.webp";
const BUNDLE_MIX_SRCSET = [
  "/images/bundles/paket-mix-4-smaker-640.webp 640w",
  "/images/bundles/paket-mix-4-smaker-960.webp 960w",
  "/images/bundles/paket-mix-4-smaker-1073.webp 1073w",
].join(", ");

const MIXED_BUNDLE_NAMES = [
  "starter pack", "startpaket",
  "monthly box", "månadslåda", "månadsbox",
  "office pack", "kontorspaket",
  "big office pack", "stort kontorspaket", "stort kontor",
];

function isMixedBundle(name: string): boolean {
  const lower = name.toLowerCase();
  return MIXED_BUNDLE_NAMES.some((n) => lower.includes(n));
}

type Highlight = "trial" | "popular" | "value" | "subscription" | null;

function parsePriceNumber(value: string | null | undefined): number | null {
  if (!value) return null;
  const cleaned = String(value).replace(/[^\d.,-]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function badgeToHighlight(badge: string | null | undefined): Highlight {
  const b = (badge ?? "").toLowerCase();
  if (!b) return null;
  if (b.includes("popular")) return "popular";
  if (b.includes("subscription") || b.includes("sub ")) return "subscription";
  if (b.includes("value")) return "value";
  if (b.includes("trial") || b.includes("try")) return "trial";
  return null;
}

// Localised label for the free-text badge stored in the CMS.
const BADGE_KEYS: [RegExp, string][] = [
  [/kr(ä|a)mig|creamy/i, "bundles.badge.creamyFavourite"],
  [/energigivande|energis/i, "bundles.badge.mostEnergising"],
  [/fiberrik|high\s*fib/i, "bundles.badge.highFibre"],
  [/italien|italian/i, "bundles.badge.italianFavourite"],
  [/team/i, "bundles.badge.teamFavourite"],
  [/perfekt start|perfect start/i, "bundles.badge.perfectStart"],
  [/mest popul|most popular/i, "bundles.badge.mostPopular"],
  [/b(ä|a)st v(ä|a)rde|best value/i, "bundles.badge.bestValue"],
];

function badgeLabel(badge: string, t: (k: string) => string): string {
  const b = badge.trim();
  for (const [re, key] of BADGE_KEYS) if (re.test(b)) return t(key);
  return b;
}

function featuresForBundle(cups: number, isSubscription: boolean): string[] {
  if (isSubscription) {
    return [
      "bundles.feat.monthlyMix",
      "bundles.feat.freeShipAlways",
      "bundles.feat.cancelAnytime",
      "bundles.feat.priorityCs",
    ];
  }
  if (cups >= 48) {
    // One-time office packs are not subscriptions — no "cancel anytime".
    return [
      "bundles.feat.mix4",
      "bundles.feat.freeShipAlways",
      "bundles.feat.delivered",
      "bundles.feat.noCommitment",
      "bundles.feat.priorityCs",
    ];
  }
  return [
    "bundles.feat.mix4",
    "bundles.feat.freeShipSe",
    "bundles.feat.delivered",
    "bundles.feat.noCommitment",
  ];
}

function findShopifyMatch(
  bundle: BundleRow,
  products: ShopifyProduct[]
): ShopifyProduct | null {
  // Explicit Shopify link from the admin is the source of truth.
  if (bundle.shopify_product_id) {
    const direct = products.find((p) => p.node.id === bundle.shopify_product_id);
    if (direct) return direct;
  }
  // Fallback: loose name match for legacy bundles without a link yet.
  const n = bundle.name.toLowerCase().trim();
  if (!n) return null;
  const exact = products.find((p) => p.node.title.toLowerCase().trim() === n);
  if (exact) return exact;
  return (
    products.find(
      (p) =>
        p.node.title.toLowerCase().includes(n) ||
        n.includes(p.node.title.toLowerCase())
    ) ?? null
  );
}

const BundleSection = () => {
  const [bundles, setBundles] = useState<BundleRow[]>([]);
  const [shopifyBundles, setShopifyBundles] = useState<ShopifyProduct[]>([]);
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const { t, lang } = useTranslation();
  const marketCfg = useMarketConfig();
  const marketName = marketLabel(marketCfg.code, lang);
  const freeShipText = t("bundles.freeShipping");
  const [mixOpen, setMixOpen] = useState(false);
  const [activeBundle, setActiveBundle] = useState<ShopifyProduct | null>(null);
  const [activeBundleCups, setActiveBundleCups] = useState<number>(0);

  useEffect(() => {
    fetchPublishedBundles().then((data) => {
      const sorted = [...data].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
      );
      setBundles(sorted);
    });
    fetchShopifyProducts(30, "product_type:Bundle OR title:Box").then((data) => {
      if (data) setShopifyBundles(data);
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
      ...(attributes ? { attributes } : {}),
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
    <section id="paket" className="py-20 md:py-28 bg-[#0a0a0a] text-white">
      <div className="container space-y-14">
        <div className="text-center space-y-3 animate-fade-up">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">{t("bundles.eyebrow")}</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold leading-tight">{t("bundles.title")}</h2>
          <p className="text-white/80 text-base md:text-lg">{t("bundles.subtitle")}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {bundles.map((b) => {
            const shopifyProduct = findShopifyMatch(b, shopifyBundles);
            const currencyCode =
              shopifyProduct?.node.priceRange.minVariantPrice.currencyCode ?? "SEK";
            const cmsPrice = parsePriceNumber(b.price);
            const shopifyPrice = shopifyProduct
              ? parseFloat(shopifyProduct.node.priceRange.minVariantPrice.amount)
              : null;
            const bundlePrice = cmsPrice ?? shopifyPrice ?? 0;
            const cups = b.meal_count;
            const perCup =
              parsePriceNumber(b.per_meal_price) ??
              (cups > 0 ? bundlePrice / cups : null);
            const fullPrice = cups > 0 ? cups * SINGLE_MEAL_PRICE : null;
            const hasSavings = !!fullPrice && fullPrice > bundlePrice;
            const highlight = badgeToHighlight(b.badge);
            const isPopular = highlight === "popular";
            const isValue = highlight === "value";
            const isTrial = highlight === "trial";
            const isSubscription = highlight === "subscription";
            const isMixable = !!b.is_mixable;
            const contents = Array.isArray(b.components)
              ? b.components
                  .map((c: any) => ({
                    name: String(c?.name ?? "").trim(),
                    quantity: Number(c?.quantity) || 0,
                  }))
                  .filter((c) => c.name.length > 0 && c.quantity > 0)
              : [];
            const showContents = !isMixable && contents.length > 0;
            const features = featuresForBundle(cups, isSubscription);
            const canBuy = !!shopifyProduct;
            const showMixedImage = isMixedBundle(b.name);

            return (
              <div
                key={b.id}
                className="relative rounded-3xl bg-[#1a1a1a] border border-white/10 p-7 md:p-8 animate-fade-up hover:border-primary/40 transition-colors flex flex-col w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                {/* Package image — mixed bundles only */}
                {showMixedImage && (
                  <div className="-mt-7 -mx-7 md:-mt-8 md:-mx-8 mb-6 rounded-t-3xl overflow-hidden aspect-video bg-white/5 shrink-0">
                    <img
                      src={bundleMixImage.url}
                      alt={t("bundles.mixImageAlt")}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                {/* Existing per-bundle image for non-mixed bundles */}
                {!showMixedImage && b.image_url && (
                  <div className="-mt-2 mb-5 -mx-2 rounded-2xl overflow-hidden bg-white/5 aspect-[4/3] flex items-center justify-center">
                    <img
                      src={b.image_url}
                      alt={`${b.name} – PLÄNTLY proteinmåltider i kopp`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
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
                  {bundlePrice >= marketCfg.freeShippingThresholdSek && (
                    <span className="rounded-full border border-white/20 text-[10px] font-bold tracking-widest uppercase py-[5px] px-[6px]">
                      {freeShipText}
                    </span>
                  )}
                  {!highlight && b.badge && (
                    <span className="rounded-full border border-white/20 text-[10px] font-bold tracking-widest uppercase py-[5px] px-[6px]">
                      {badgeLabel(b.badge, t)}
                    </span>
                  )}
                </div>

                {/* Title + subtitle */}
                <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">{b.name}</h3>
                {cups && (
                  <p className="text-sm text-white/75 mb-6">
                    {cups} {t("bundles.cups")}
                  </p>
                )}

                {/* Price block */}
                <div className="mb-5">
                  <p className="font-heading text-5xl md:text-6xl font-bold leading-none">
                    {bundlePrice.toFixed(0)} <span className="text-2xl font-bold align-top">{currencyCode}</span>
                  </p>
                  {perCup && (
                    <p className="text-sm text-white/80 mt-3">
                      {perCup.toFixed(0)} {t("bundles.perCup")}
                    </p>
                  )}
                </div>

                {/* Savings strip */}
                {hasSavings && (
                  <div className="mb-5">
                    <SavingsBadge
                      title={b.name}
                      bundlePrice={bundlePrice}
                      currencyCode={currencyCode}
                      variant={isTrial ? "trial" : isValue || isSubscription ? "value" : "default"}
                      size="sm"
                    />
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {features.map((fk) => {
                    let label = t(fk);
                    if (fk === "bundles.feat.mix4" && b.name.toLowerCase().includes("box")) {
                      let flavor = b.name.replace(/\s*Box$/i, "");
                      // Special case: Add "Pasta" for Italian flavors if requested
                      if (flavor.toLowerCase() === "bolognese" || flavor.toLowerCase() === "carbonara") {
                        flavor = `Pasta\u00A0${flavor}`;
                      }
                      label = t("bundles.feat.singleFlavor")
                        .replace("{count}", String(cups))
                        .replace("{name}", flavor);
                    }
                    if (fk === "bundles.feat.freeShipSe" || fk === "bundles.feat.freeShipAlways") {
                      label = bundlePrice >= marketCfg.freeShippingThresholdSek
                        ? (marketCfg.code === "SE"
                            ? t("bundles.freeShipping")
                            : t("bundles.freeShippingMarket").replace("{market}", marketName))
                        : t("shipping.standardCost")
                            .replace("{amount}", String(marketCfg.shippingCost))
                            .replace("{currency}", marketCfg.currency);
                    }
                    return (
                      <li key={fk} className="flex items-start gap-2.5 text-sm text-white/85">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{label}</span>
                      </li>
                    );
                  })}
                </ul>

                {showContents && (
                  <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/60 mb-2">
                      {t("bundles.whatsInside")}
                    </p>
                    <ul className="space-y-1.5">
                      {contents.map((c, i) => (
                        <li key={i} className="flex items-center justify-between gap-3 text-sm text-white/90">
                          <span className="min-w-0 break-words">{displayProductTitle(c.name)}</span>
                          <span className="font-semibold tabular-nums shrink-0 whitespace-nowrap">× {c.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <Button
                  onClick={() => {
                    if (!shopifyProduct) return;
                    if (isMixable && cups > 1) {
                      openMixFor(shopifyProduct, cups);
                    } else {
                      handleAddToCart(shopifyProduct);
                    }
                  }}
                  disabled={isLoading || !canBuy}
                  className={`w-full rounded-full font-semibold h-12 text-base ${
                    isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : canBuy ? (
                    t("bundles.orderNow")
                  ) : (
                    "Coming soon"
                  )}
                </Button>
                {!canBuy && (
                  <p className="mt-2 text-[11px] text-white/80 text-center">
                    Not yet linked to a Shopify product
                  </p>
                )}
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
