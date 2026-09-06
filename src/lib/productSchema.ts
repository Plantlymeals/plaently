import { canonicalizeHandle, getProductSeo, getProductSsrCopy, productUrl } from "@/lib/productSeo";
import { resolveProductImageUrl } from "@/lib/productImages";

export type ProductOffer = {
  price: string;
  currency: string;
  available: boolean;
} | null;

export type ProductRating = {
  count: number;
  avg: number;
} | null;

export type ProductSchemaInput = {
  handle: string;
  offer?: ProductOffer;
  rating?: ProductRating;
  shopifyImageUrl?: string | null;
  imageOverrideUrl?: string | null;
  name?: string | null;
  description?: string | null;
  locale?: "sv" | "en";
};

/**
 * Single source of truth for Product JSON-LD. Used by the route `head()` so the
 * schema is present in the raw server-rendered HTML (Google never executed the
 * old client-only Helmet version).
 */
export function buildProductJsonLd(input: ProductSchemaInput): Record<string, unknown> {
  const handle = canonicalizeHandle(input.handle);
  const seo = getProductSeo(handle);
  const locale = input.locale ?? "sv";
  const ssr = getProductSsrCopy(handle, locale);
  const name = seo?.schema.name ?? input.name ?? ssr.name;
  const description =
    locale === "en"
      ? (seo?.en.description ?? input.description ?? ssr.description)
      : (seo?.schema.description ?? input.description ?? ssr.description);
  const pageUrl = productUrl(handle, locale);
  const image = resolveProductImageUrl({
    handle,
    title: name,
    overrideUrl: input.imageOverrideUrl ?? null,
    shopifyUrl: input.shopifyImageUrl ?? null,
  });

  const offer = input.offer;
  const rating = input.rating;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: [image],
    url: pageUrl,
    inLanguage: locale === "en" ? "en-GB" : "sv-SE",
    brand: { "@type": "Brand", name: "PLÄNTLY" },
    ...(seo && {
      sku: seo.schema.sku,
      nutrition: {
        "@type": "NutritionInformation",
        servingSize: seo.schema.servingSize,
        calories: seo.schema.calories,
        proteinContent: seo.schema.protein,
      },
    }),
    ...(offer && {
      offers: {
        "@type": "Offer",
        url: pageUrl,
        price: offer.price,
        priceCurrency: offer.currency,
        availability: offer.available
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "PLÄNTLY AB" },
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
          shippingRate: { "@type": "MonetaryAmount", value: "49", currency: "SEK" },
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "SE" },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "d" },
            transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 4, unitCode: "d" },
          },
        },
      },
    }),
    ...(rating && rating.count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.avg.toFixed(1),
        reviewCount: rating.count,
        bestRating: "5",
        worstRating: "1",
      },
    }),
  };
}
