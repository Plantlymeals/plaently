import { Link } from "@/lib/router-compat";
import { useEffect, useState } from "react";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { getBundleSavings } from "@/lib/bundleSavings";
import { useBundleMix } from "@/hooks/useBundleMix";
import { MixBuilderDialog } from "@/components/MixBuilderDialog";
import { getCupMeta, displayProductTitle } from "@/lib/productImages";
import CupBadges from "@/components/CupBadges";

const ProductOverview = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const { t } = useTranslation();
  const { handleAdd, isLoading, dialogProps } = useBundleMix();

  useEffect(() => {
    // Hämta brett och filtrera till de fyra smakerna — aldrig ett paket.
    fetchShopifyProducts(20).then((data) => {
      if (data) setProducts(data.filter((p) => isListableProduct(p.node.title)).slice(0, 4));
    });
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">{t("products.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("products.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const image = product.node.images.edges[0]?.node;
            const cupMeta = getCupMeta(product.node.title);
            const price = product.node.priceRange.minVariantPrice;
            return (
              <div key={product.node.id} className="group rounded-2xl bg-card border border-border/50 p-4 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-up">
                <Link to={`/product/${product.node.handle}`}>
                  <div className="relative aspect-square rounded-xl mb-5 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#d9d9d9" }}>
                    {cupMeta && <CupBadges meta={cupMeta} />}
                    {cupMeta ? (
                      <img src={cupMeta.src} alt={`${displayProductTitle(product.node.title)} — plantbaserad måltidskopp med 20g protein`} className="h-full w-full object-cover" loading="lazy" />
                    ) : image ? (
                      <img src={`${image.url}&width=520`} alt={image.altText || `${displayProductTitle(product.node.title)} — plantbaserad måltidskopp med 20g protein`} className="h-full w-full object-contain rounded-xl" loading="lazy" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-muted-foreground/10" aria-hidden="true" />
                    )}
                  </div>
                  <h3 className="font-heading font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors">{displayProductTitle(product.node.title)}</h3>
                  {(() => {
                    const amount = parseFloat(price.amount);
                    const savings = getBundleSavings(product.node.title, amount);
                    return (
                      <div className="mb-3 space-y-1">
                        <p className="text-lg font-bold text-primary">{price.currencyCode} {amount.toFixed(2)}</p>
                        {savings && savings.savingsPercent > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground line-through">
                              {price.currencyCode} {savings.fullPrice}
                            </span>
                            <span className="inline-block text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                              {t("bundles.save")} {savings.savingsPercent}%
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </Link>
                <Button onClick={() => handleAdd(product)} disabled={isLoading} className="w-full rounded-full font-semibold text-sm" size="sm">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("products.addToCart")}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <MixBuilderDialog {...dialogProps} />
    </section>
  );
};

export default ProductOverview;
