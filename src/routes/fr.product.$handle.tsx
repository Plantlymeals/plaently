import { createFileRoute, redirect, notFound, Link } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";
import { getProductRouteHead, canonicalizeHandle } from "@/lib/productSeo";
import { buildProductJsonLd } from "@/lib/productSchema";
import { loadProductSchemaData } from "@/lib/seoLoaders";
import { isFrenchPilotHandle, isFrenchPageReady } from "@/data/productCopyFr";
import Layout from "@/components/Layout";

export const Route = createFileRoute("/fr/product/$handle")({
  beforeLoad: ({ params }) => {
    const canonical = canonicalizeHandle(params.handle);
    // Only the five pilot products have a French page; everything else
    // belongs on the Swedish URL.
    if (!isFrenchPilotHandle(canonical)) {
      throw redirect({
        to: "/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    if (canonical !== params.handle) {
      throw redirect({
        to: "/fr/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    return { pageLocale: "fr" as const };
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
          { title: "Nie znaleziono produktu — PLÄNTLY" },
          { name: "robots", content: "noindex, follow" },
        ],
      };
    }
    return {
      ...getProductRouteHead(params.handle, "fr", {
        // Stays out of the index until the French ingredient/nutrition/allergen
        // text has been manually reviewed and approved.
        noindex: !isFrenchPageReady(params.handle),
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildProductJsonLd({
              handle: params.handle,
              locale: "fr",
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
  notFoundComponent: ProductNotFoundFr,
  component: ProductDetail,
});

function ProductNotFoundFr() {
  return (
    <Layout>
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-heading text-3xl font-bold">Nie znaleziono produktu</h1>
        <p className="text-muted-foreground">Ten adres już nie istnieje. Zobacz naszą ofertę.</p>
        <Link
          to="/fr/products"
          className="inline-block rounded-full border border-border px-6 py-2 hover:text-primary"
        >
          Zobacz produkty
        </Link>
      </div>
    </Layout>
  );
}
