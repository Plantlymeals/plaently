import { Link, useParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Check, Flame, Leaf, Clock, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchShopifyProducts, fetchShopifyProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { getBundleSavings } from "@/lib/bundleSavings";
import { useBundleMix } from "@/hooks/useBundleMix";
import { MixBuilderDialog } from "@/components/MixBuilderDialog";
import { getBundleCupsFromTitle } from "@/hooks/useBundleMix";
import BundleSection from "@/components/home/BundleSection";
import { getCupMeta } from "@/lib/productImages";
import CupBadges from "@/components/CupBadges";

const ProductDetail = () => {
  const { slug, handle } = useParams<{ slug?: string; handle?: string }>();
  const productHandle = handle || slug;
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<{ author_name: string; author_role: string | null; quote: string }[]>([]);
  const { t } = useTranslation();
  const { handleAdd, isLoading, dialogProps } = useBundleMix();

  useEffect(() => {
    if (!productHandle) return;
    fetchShopifyProductByHandle(productHandle).then((data) => {
      setProduct(data);
      setLoading(false);
    });
    supabase
      .from("testimonials")
      .select("author_name, author_role, quote")
      .eq("is_published", true)
      .order("sort_order")
      .limit(3)
      .then(({ data }) => {
        if (data) setReviews(data as any);
    });
  }, [productHandle]);

  if (loading) {
    return <Layout><div className="container py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div></Layout>;
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">{t("products.notFound")}</h1>
          <Button asChild variant="outline" className="rounded-full"><Link to="/products">{t("products.backToProducts")}</Link></Button>
        </div>
      </Layout>
    );
  }

  const selectedVariant = product.variants.edges[0]?.node;
  const image = product.images.edges[0]?.node;
  const cupMeta = getCupMeta(product.title);
  const price = selectedVariant?.price;

  const handleAddToCart = () => handleAdd({ node: product } as ShopifyProduct);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: image?.url,
    url: `https://plantlymeals.com/product/${product.handle}`,
    brand: { "@type": "Brand", name: "PLÄNTLY" },
    ...(price && {
      offers: {
        "@type": "Offer",
        price: parseFloat(price.amount).toFixed(2),
        priceCurrency: price.currencyCode,
        availability: selectedVariant?.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 14,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/ReturnShippingFees",
          applicableCountry: "SE",
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "49",
            currency: "SEK",
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "SE",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 1,
              unitCode: "d",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 2,
              maxValue: 4,
              unitCode: "d",
            },
          },
        },
      },
    }),
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: String(reviews.length),
        bestRating: "5",
        worstRating: "1",
      },
      review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author_name },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: r.quote,
      })),
    }),
  };

  return (
    <Layout>
      <SEOHead
        title={`${product.title} — PLÄNTLY`}
        description={product.description || "Högprotein växtbaserad färdigrätt från PLÄNTLY."}
        path={`/product/${product.handle}`}
        type="product"
        jsonLd={jsonLd}
      />
      <section className="py-12 md:py-20">
        <div className="container">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> {t("products.backToProducts")}
          </Link>
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="relative h-80 md:h-[28rem] rounded-2xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#d9d9d9" }}>
              {cupMeta && <CupBadges meta={cupMeta} size="md" />}
              {cupMeta ? (
                <img src={cupMeta.src} alt={product.title} className="h-full w-full object-cover" />
              ) : image ? (
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
                (() => {
                  const amount = parseFloat(price.amount);
                  const savings = getBundleSavings(product.title, amount);
                  return (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-3xl font-bold text-primary">{price.currencyCode} {amount.toFixed(2)}</span>
                      {savings && savings.savingsPercent > 0 ? (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            {price.currencyCode} {savings.fullPrice}
                          </span>
                          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-0.5">
                            {t("bundles.save")} {savings.savingsPercent}%
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">{t("products.perMeal")}</span>
                      )}
                    </div>
                  );
                })()
              )}
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleAddToCart} disabled={isLoading || !selectedVariant} className="rounded-full px-8 font-semibold">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("products.addToCart")}
                </Button>
              </div>
              {product.descriptionHtml && (
                <div
                  className="prose prose-sm max-w-none [&_h3]:font-heading [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mt-6 [&_h3]:mb-2 [&_table]:w-full [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-border/50 [&_th]:bg-secondary [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground [&_td]:px-4 [&_td]:py-2 [&_td]:text-sm [&_td]:border-t [&_td]:border-border/30 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_strong]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              )}
            </div>
          </div>

          {/* Product story sections */}
          <div className="mt-20 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-card border border-border/50 p-6 shadow-card">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><Flame className="h-5 w-5" /></div>
              <h2 className="font-heading font-semibold text-base mb-2">{t("productDetail.tasteTitle")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("productDetail.tasteDesc")}</p>
            </div>
            <div className="rounded-2xl bg-card border border-border/50 p-6 shadow-card">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><Leaf className="h-5 w-5" /></div>
              <h2 className="font-heading font-semibold text-base mb-3">{t("productDetail.nutritionTitle")}</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{t("productDetail.nutritionProtein")}</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{t("productDetail.nutritionMacros")}</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{t("productDetail.nutritionClean")}</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-card border border-border/50 p-6 shadow-card">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><Clock className="h-5 w-5" /></div>
              <h2 className="font-heading font-semibold text-base mb-3">{t("productDetail.prepTitle")}</h2>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>{t("productDetail.prepStep1")}</li>
                <li>{t("productDetail.prepStep2")}</li>
                <li>{t("productDetail.prepStep3")}</li>
              </ol>
            </div>
          </div>

          <div className="mt-12 rounded-3xl gradient-hero p-10 md:p-14 text-center text-primary-foreground">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">{t("productDetail.benefitsTitle")}</h2>
            <p className="max-w-2xl mx-auto opacity-90 mb-6">{t("productDetail.benefitsDesc")}</p>
            <Button onClick={handleAddToCart} disabled={isLoading || !selectedVariant} size="lg" className="rounded-full px-8 font-semibold bg-background text-foreground hover:bg-background/90">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("products.addToCart")}
            </Button>
          </div>

          {reviews.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-center gap-2 mb-2">
                {[0,1,2,3,4].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
                <span className="ml-2 font-semibold text-foreground">4.9</span>
                <span className="text-sm text-muted-foreground">({reviews.length})</span>
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8">
                {t("productDetail.reviewsTitle") || "What customers say"}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {reviews.map((r, i) => (
                  <div key={i} className="rounded-2xl bg-card border border-border/50 p-6 shadow-card">
                    <div className="flex gap-1 mb-3">
                      {[0,1,2,3,4].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-4">"{r.quote}"</p>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{r.author_name}</p>
                      {r.author_role && (
                        <p className="text-xs text-muted-foreground">{r.author_role}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <MixBuilderDialog {...dialogProps} />
    </Layout>
  );
};

// Products grid page
const Products = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { handleAdd, isLoading: cartIsLoading, dialogProps } = useBundleMix();

  useEffect(() => {
    fetchShopifyProducts(20).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <SEOHead title="Produkter – Hälsosam proteinmat på 5 min | PLÄNTLY" description="Utforska PLÄNTLY:s sortiment: hälsosam, proteinrik och klimatsmart färdigmat med 20g protein per portion. Klar på 5 minuter." path="/products" />
      <section className="py-12 md:py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{t("products.pageTitle")}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("products.pageSubtitle")}</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">{t("products.noProducts")}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...products]
                .filter((p) => !getBundleCupsFromTitle(p.node.title))
                .sort((a, b) => parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount)).map((product) => {
                const image = product.node.images.edges[0]?.node;
                const cupMeta = getCupMeta(product.node.title);
                const price = product.node.priceRange.minVariantPrice;
                return (
                  <div key={product.node.id} className="group rounded-2xl bg-card border border-border/50 p-4 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                    <Link to={`/product/${product.node.handle}`}>
                      <div className="relative aspect-square rounded-xl mb-5 flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#d9d9d9" }}>
                        {cupMeta && <CupBadges meta={cupMeta} />}
                        {cupMeta ? (
                          <img src={cupMeta.src} alt={product.node.title} className="h-full w-full object-cover" loading="lazy" />
                        ) : image ? (
                          <img src={`${image.url}&width=520`} alt={image.altText || product.node.title} className="h-full w-full object-contain" loading="lazy" />
                        ) : (
                          <span className="text-4xl">🍝</span>
                        )}
                      </div>
                      <h2 className="font-heading font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors">{product.node.title}</h2>
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
                    <Button onClick={() => handleAdd(product)} disabled={cartIsLoading} className="w-full rounded-full font-semibold text-sm" size="sm">
                      {cartIsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t("products.addToCart")}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <BundleSection />
      <MixBuilderDialog {...dialogProps} />
    </Layout>
  );
};

export { Products, ProductDetail };
