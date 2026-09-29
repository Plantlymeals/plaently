import { createFileRoute } from "@tanstack/react-router";
import { Products } from "@/pages/Products";
import { getProductList } from "@/lib/products.functions";
import { getProductListHead } from "@/lib/productSeo";


export const Route = createFileRoute("/en/products")({
  beforeLoad: () => ({ pageLocale: "en" as const }),
  loader: () => getProductList(),
  head: ({ loaderData }) => ({
    ...getProductListHead("en"),
    scripts:
      loaderData && !loaderData.error && loaderData.products.length > 0
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: loaderData.products.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  item: {
                    "@type": "Product",
                    name: p.title,
                    url: `https://plaently.com/product/${p.handle}`,
                    ...(p.image ? { image: p.image.url } : {}),
                    offers: {
                      "@type": "Offer",
                      price: p.price.amount,
                      priceCurrency: p.price.currencyCode,
                      availability: "https://schema.org/InStock",
                    },
                  },
                })),
              }),
            },
          ]
        : [],
  }),
  component: Products,
});
