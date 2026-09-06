import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { getCupImage, displayProductTitle } from "@/lib/productImages";
import { useTranslation } from "@/lib/i18n";
import { fetchPublishedBundles, type BundleRow } from "@/lib/bundlesApi";
import { useMarketConfig } from "@/stores/marketStore";
import { marketLabel } from "@/lib/markets";
import { Progress } from "@/components/ui/progress";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { pickFreeShippingBundle } from "@/lib/bundleMatch";
import { useBundleMix } from "@/hooks/useBundleMix";
import { MixBuilderDialog } from "@/components/MixBuilderDialog";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const { t, lang } = useTranslation();
  const [bundles, setBundles] = useState<BundleRow[]>([]);
  const marketCfg = useMarketConfig();
  const marketName = marketLabel(marketCfg.code, lang);
  const threshold = marketCfg.freeShippingThresholdSek;
  const qualifiesFreeShipping = totalPrice >= threshold;
  const remaining = Math.max(0, threshold - totalPrice);
  const progressPct = Math.min(100, (totalPrice / threshold) * 100);

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);
  useEffect(() => { if (isOpen && bundles.length === 0) fetchPublishedBundles().then(setBundles); }, [isOpen, bundles.length]);

  const getBundleComponents = (title: string): Array<{ name: string; quantity: number }> => {
    const titleLower = title.toLowerCase();
    const match = bundles.find((b) => titleLower.includes(String(b.name).toLowerCase()));
    if (!match || match.is_mixable) return [];
    return Array.isArray(match.components)
      ? (match.components as any[])
          .map((c: any) => ({ name: String(c?.name ?? "").trim(), quantity: Number(c?.quantity) || 0 }))
          .filter((c) => c.name.length > 0 && c.quantity > 0)
      : [];
  };

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full" aria-label={t("cart.title")}>
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">{totalItems}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-heading">{t("cart.title")}</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? t("cart.empty") : `${totalItems} ${totalItems !== 1 ? t("cart.products") : t("cart.product")} ${t("cart.inCart")}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("cart.empty")}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.lineId ?? item.variantId} className="flex gap-4 p-3 rounded-xl bg-muted/50">
                      <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                        {(() => {
                          const cup = getCupImage(item.product.node.title);
                          const fallback = item.product.node.images?.edges?.[0]?.node?.url;
                          const src = cup || fallback;
                          return src ? <img src={src} alt={item.product.node.title} className={`w-full h-full ${cup ? "object-contain" : "object-cover"}`} /> : null;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{displayProductTitle(item.product.node.title)}</h4>
                        {item.attributes && item.attributes.length > 0 && (
                          <ul className="mt-1 space-y-0.5">
                            {item.attributes
                              .filter(a => !a.key.startsWith("_"))
                              .map((a) => (
                                <li key={a.key} className="text-[11px] text-muted-foreground truncate">
                                  {a.key}: <span className="text-foreground">{a.value}</span>
                                </li>
                              ))}
                          </ul>
                        )}
                        {(() => {
                          const comps = getBundleComponents(item.product.node.title);
                          if (comps.length === 0) return null;
                          return (
                            <div className="mt-2 rounded-md bg-background/60 border border-border/50 p-2">
                              <p className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mb-1">
                                {t("bundles.whatsInside")}
                              </p>
                              <ul className="space-y-0.5">
                                {comps.map((c, i) => (
                                  <li key={i} className="flex items-center justify-between text-[11px] text-muted-foreground">
                                    <span className="flex items-center gap-1 truncate">
                                      <Check className="h-3 w-3 text-primary shrink-0" />
                                      <span className="truncate">{c.name}</span>
                                    </span>
                                    <span className="tabular-nums font-medium text-foreground">× {c.quantity * item.quantity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })()}
                        <p className="font-semibold text-primary">{item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6" aria-label={t("cart.remove") || "Remove"} onClick={() => removeItem(item.lineId ?? item.variantId)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" aria-label={t("cart.decrease") || "Decrease quantity"} onClick={() => updateQuantity(item.lineId ?? item.variantId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" aria-label={t("cart.increase") || "Increase quantity"} onClick={() => updateQuantity(item.lineId ?? item.variantId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  {qualifiesFreeShipping ? (
                    <p className="text-xs font-semibold text-primary text-center">
                      {t("cart.freeShippingUnlocked").replace("{market}", marketName)}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center">
                      {t("cart.freeShippingProgress")
                        .replace("{amount}", remaining.toFixed(0))
                        .replace("{currency}", items[0]?.price.currencyCode ?? "SEK")
                        .replace("{market}", marketName)}
                    </p>
                  )}
                  <Progress value={progressPct} className="h-1.5" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{t("cart.shippingLabel")}</span>
                    <span className={qualifiesFreeShipping ? "font-bold text-primary" : "font-medium"}>
                      {qualifiesFreeShipping
                        ? t("cart.shippingFree")
                        : `${marketCfg.shippingCost} ${marketCfg.currency}`}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{t("cart.total")}</span>
                  <span className="text-xl font-bold text-primary">{items[0]?.price.currencyCode} {totalPrice.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full rounded-full font-semibold" size="lg" disabled={items.length === 0 || isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4 mr-2" />{t("cart.checkout")}</>}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
