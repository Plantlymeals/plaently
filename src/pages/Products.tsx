import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchShopifyProducts, fetchShopifyProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug, handle } = useParams<{ slug?: string; handle?: string }>();
  const productHandle = handle || slug;
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    if (!productHandle) return;
    fetchShopifyProductByHandle(productHandle).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [productHandle]);

  if (loading) {
    return <Layout><div className="container py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div></Layout>;
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">Product not found</h1>
          <Button asChild variant="outline" className="rounded-full"><Link to="/products">Back to Products</Link></Button>
        </div>
      </Layout>
    );
  }

  const selectedVariant = product.variants.edges[0]?.node;
  const image = product.images.edges[0]?.node;
  const price = selectedVariant?.price;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to cart!", { position: "top-center" });
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="h-80 md:h-[28rem] rounded-2xl bg-secondary flex items-center justify-center p-8">
              {image ? (
                <img src={image.url} alt={image.altText || product.title} className="h-full w-full object-contain" />
              ) : (
                <span className="text-8xl">🍝</span>
              )}
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <h1 className="font-heading text-3xl md:text-4xl font-bold">{product.title}</h1>
              </div>

              {price && (
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-primary">{price.currencyCode} {parseFloat(price.amount).toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">per meal</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isLoading || !selectedVariant}
                  className="rounded-full px-8 font-semibold"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Cart"}
                </Button>
              </div>

              {product.descriptionHtml && (
                <div
                  className="prose prose-sm max-w-none
                    [&_h3]:font-heading [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mt-6 [&_h3]:mb-2
                    [&_table]:w-full [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-border/50
                    [&_th]:bg-secondary [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground
                    [&_td]:px-4 [&_td]:py-2 [&_td]:text-sm [&_td]:border-t [&_td]:border-border/30
                    [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed
                    [&_strong]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Products grid page
const Products = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const cartIsLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    fetchShopifyProducts(20).then((data) => {
      setProducts(data);
      setLoading(false);
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
    toast.success("Added to cart!", { position: "top-center" });
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Plant-Based Protein Meals</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              High protein vegan meals ready in 5 minutes. Plant protein pasta, curries &amp; more — pick your favourites.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No products found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const image = product.node.images.edges[0]?.node;
                const price = product.node.priceRange.minVariantPrice;
                return (
                  <div
                    key={product.node.id}
                    className="group rounded-2xl bg-card border border-border/50 p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                  >
                    <Link to={`/product/${product.node.handle}`}>
                      <div className="h-40 rounded-xl bg-secondary mb-5 flex items-center justify-center p-4">
                        {image ? (
                          <img src={image.url} alt={image.altText || `${product.node.title} — plant-based protein meal`} className="h-full w-full object-contain" loading="lazy" />
                        ) : (
                          <span className="text-4xl">🍝</span>
                        )}
                      </div>
                      <h3 className="font-heading font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors">{product.node.title}</h3>
                      <p className="text-lg font-bold text-primary mb-3">{price.currencyCode} {parseFloat(price.amount).toFixed(2)}</p>
                    </Link>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={cartIsLoading}
                      className="w-full rounded-full font-semibold text-sm"
                      size="sm"
                    >
                      {cartIsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Cart"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export { Products, ProductDetail };
