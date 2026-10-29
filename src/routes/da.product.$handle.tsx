import { createFileRoute, redirect, notFound, Link } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";
import { getProductRouteHead, canonicalizeHandle } from "@/lib/productSeo";
import { buildProductJsonLd } from "@/lib/productSchema";
import { loadProductSchemaData } from "@/lib/seoLoaders";
import { isDanishPilotHandle, isDanishPageReady } from "@/data/productCopyDa";
import Layout from "@/components/Layout";

export const Route = createFileRoute("/da/product/$handle")({
  beforeLoad: ({ params }) => {
    const canonical = canonicalizeHandle(params.handle);
    // Only the five pilot products have a Danish page; everything else
    // belongs on the Swedish URL.
    if (!isDanishPilotHandle(canonical)) {
      throw redirect({
        to: "/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    if (canonical !== params.handle) {
      throw redirect({
        to: "/da/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    return { pageLocale: "da" as const };
  },
  loader: async ({ params }) => {
    const data = await loadProductSchemaData(canonicalizeHandle(params.handle));
    if (data.confirmedMiss) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Produkt ikke fundet — PLÄNTLY" },
          { name: "robots", content: "noindex, follow" },
        ],
      };
    }
    return {
      ...getProductRouteHead(params.handle, "da", {
        // Stays out of the index until the Danish ingredient/nutrition/allergen
        // text has been manually reviewed and approved.
        noindex: !isDanishPageReady(params.handle),
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildProductJsonLd({
              handle: params.handle,
              locale: "da",
                  offer: loaderData.offer ?? null,
                  rating: loaderData.rating ?? null,
                  shopifyImageUrl: loaderData.shopifyImageUrl ?? null,
                  name: loaderData.name ?? null,
                  description: loaderData.description ?? null,
            })
          ),
        },
      ],
    };
  },
  notFoundComponent: ProductNotFoundDa,
  component: ProductDetail,
});

function ProductNotFoundDa() {
  return (
    <Layout>
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-heading text-3xl font-bold">Produkt ikke fundet</h1>
        <p className="text-muted-foreground">Denne adresse findes ikke længere. Udforsk vores udvalg.</p>
        <Link
          to="/da/products"
          className="inline-block rounded-full border border-border px-6 py-2 hover:text-primary"
        >
          Se produkter
        </Link>
      </div>
    </Layout>
  );
}
