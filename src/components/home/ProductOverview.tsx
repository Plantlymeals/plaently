import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const ProductOverview = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const { t } = useTranslation();

  useEffect(() => {
    fetchShopifyProducts(4).then((data) => {
      if (data) setProducts(data);
    });
  }, []);

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
            const price = product.node.priceRange.minVariantPrice;
            return (
              <div key={product.node.id} className="group rounded-2xl bg-card border border-border/50 p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-up">
                <Link to={`/product/${product.node.handle}`}>
                  <div className="h-40 rounded-xl bg-secondary mb-5 flex items-center justify-center">
                    {image ? (
                      <img src={image.url} alt={image.altText || product.node.title} className="h-full w-full object-contain rounded-xl" />
                    ) : (
                      <span className="text-4xl">🍝</span>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors">{product.node.title}</h3>
                  <p className="text-lg font-bold text-primary mb-3">{price.currencyCode} {parseFloat(price.amount).toFixed(2)}</p>
                </Link>
                <Button onClick={() => handleAddToCart(product)} disabled={isLoading} className="w-full rounded-full font-semibold text-sm" size="sm">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("products.addToCart")}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductOverview;
