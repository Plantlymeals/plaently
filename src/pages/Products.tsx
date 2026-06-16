import { Link, useParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Check, Flame, Leaf, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchShopifyProducts, fetchShopifyProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { useTranslation } from "@/lib/i18n";
import { translateProductHtml, translateProductText } from "@/lib/productDescription";
import { supabase } from "@/integrations/supabase/client";
import { getBundleSavings } from "@/lib/bundleSavings";
import { useBundleMix } from "@/hooks/useBundleMix";
import { MixBuilderDialog } from "@/components/MixBuilderDialog";
import { getBundleCupsFromTitle } from "@/hooks/useBundleMix";
import BundleSection from "@/components/home/BundleSection";
import { getCupMeta } from "@/lib/productImages";
import CupBadges from "@/components/CupBadges";
import ProductReviews from "@/components/ProductReviews";

const ProductDetail = () => {
  const { slug, handle } = useParams<{ slug?: string; handle?: string }>();
  const productHandle = handle || slug;
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState<{ count: number; avg: number; items: Array<{ author_name: string; rating: number; title: string | null; body: string; created_at: string }> }>({ count: 0, avg: 0, items: [] });
  const [bundleContents, setBundleContents] = useState<Array<{ name: string; quantity: number }>>([]);
  const { t, lang } = useTranslation();
  const { handleAdd, isLoading, dialogProps } = useBundleMix();

  useEffect(() => {
    if (!productHandle) return;
    fetchShopifyProductByHandle(productHandle).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [productHandle]);

  useEffect(() => {
    if (!productHandle) return;
    supabase
      .from("product_reviews")
      .select("author_name, rating, title, body, created_at")
      .eq("product_slug", productHandle)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const items = data as any[];
        const avg = items.reduce((s, r) => s + r.rating, 0) / items.length;
        setReviewData({ count: items.length, avg: Math.round(avg * 10) / 10, items });
      });
  }, [productHandle]);

  useEffect(() => {
    if (!product) return;
    const titleLower = product.title.toLowerCase();
    (async () => {
      const { data, error } = await supabase
        .from("bundles")
        .select("name,is_mixable,components")
        .eq("is_published", true);
      console.log("[bundleContents] fetch", { titleLower, error, data });
      if (!data) return;
      const match = data.find((b: any) =>
        titleLower.includes(String(b.name).toLowerCase())
      );
      console.log("[bundleContents] match", match);
      if (!match || match.is_mixable) {
        setBundleContents([]);
        return;
      }
      const comps = Array.isArray(match.components)
        ? (match.components as any[])
            .map((c: any) => ({
              name: String(c?.name ?? "").trim(),
              quantity: Number(c?.quantity) || 0,
            }))
            .filter((c) => c.name.length > 0 && c.quantity > 0)
        : [];
      console.log("[bundleContents] comps", comps);
      setBundleContents(comps);
    })();
  }, [product]);

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
  const translatedHtml = translateProductHtml(product.descriptionHtml, lang);
  const translatedDesc = translateProductText(product.description, lang);

  const handleAddToCart = () => handleAdd({ node: product } as ShopifyProduct);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: image?.url,
    url: `https://plaently.com/product/${product.handle}`,
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
    ...(reviewData.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: reviewData.avg.toFixed(1),
        reviewCount: reviewData.count,
        bestRating: "5",
        worstRating: "1",
      },
      review: reviewData.items.slice(0, 10).map((r) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: "5",
          worstRating: "1",
        },
        author: { "@type": "Person", name: r.author_name },
        datePublished: r.created_at,
        ...(r.title && { name: r.title }),
        reviewBody: r.body,
      })),
    }),
  };

  return (
    <Layout>
      <SEOHead
        title={lang === "sv"
          ? `${product.title} – 20g protein på 5 min | PLÄNTLY`
          : `${product.title} – 20g protein in 5 min | PLÄNTLY`}
        description={translatedDesc || (lang === "sv"
          ? `Hälsosam ${product.title.toLowerCase()} med 20g protein per portion – snabb, mättande och klimatsmart. Klar på 5 minuter. Beställ online från PLÄNTLY.`
          : `Healthy ${product.title.toLowerCase()} with 20g protein per serving – quick, filling and climate-smart. Ready in 5 minutes. Order online from PLÄNTLY.`)}
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
                <img src={cupMeta.src} alt={`${product.title} — plantbaserad måltidskopp med 20g protein per portion`} className="h-full w-full object-cover" />
              ) : image ? (
                <img src={image.url} alt={image.altText || `${product.title} — plantbaserad måltidskopp med 20g protein per portion`} className="h-full w-full object-contain" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-muted-foreground/10" aria-hidden="true" />
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
              {bundleContents.length > 0 && (
                <div className="rounded-2xl border border-border/60 bg-secondary/40 p-5">
                  <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground mb-3">
                    {lang === "sv" ? "Vad ingår" : "What's inside"}
                  </p>
                  <ul className="space-y-2">
                    {bundleContents.map((c, i) => (
                      <li key={i} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          {c.name}
                        </span>
                        <span className="font-semibold tabular-nums">× {c.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {translatedHtml && (
                <div
                  className="prose prose-sm max-w-none [&_h3]:font-heading [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mt-6 [&_h3]:mb-2 [&_table]:w-full [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-border/50 [&_th]:bg-secondary [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground [&_td]:px-4 [&_td]:py-2 [&_td]:text-sm [&_td]:border-t [&_td]:border-border/30 [&_p]:text-sm [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_strong]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: translatedHtml }}
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

          <ProductReviews productSlug={product.handle} title={product.title} />
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
                .filter((p) => {
                  const title = p.node.title.toLowerCase();
                  return !getBundleCupsFromTitle(title) && !title.includes("taster") && !title.includes("pack");
                })
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
                          <img src={cupMeta.src} alt={`${product.node.title} — plantbaserad måltidskopp med 20g protein`} className="h-full w-full object-cover" loading="lazy" />
                        ) : image ? (
                          <img src={`${image.url}&width=520`} alt={image.altText || `${product.node.title} — plantbaserad måltidskopp med 20g protein`} className="h-full w-full object-contain" loading="lazy" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-muted-foreground/10" aria-hidden="true" />
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
