import { createFileRoute } from "@tanstack/react-router";
import { Products } from "@/pages/Products";
import { getProductList } from "@/lib/products.functions";

const TITLE = "Proteinmåltider | 20g protein på 5 min | PLÄNTLY";
const DESCRIPTION = "Fyra proteinmåltider med 20g protein per portion — Fusilli Bolognese, Pasta Carbonara, Yellow Curry & Rice och Smoky BBQ Lentils. Klara på 5 minuter, bara tillsätt kokande vatten.";
const URL = "https://plaently.com/products";

export const Route = createFileRoute("/products")({
  loader: () => getProductList(),
  head: ({ loaderData }) => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "sv_SE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hrefLang: "sv", href: URL },
      { rel: "alternate", hrefLang: "en", href: URL },
      { rel: "alternate", hrefLang: "x-default", href: URL },
    ],
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
