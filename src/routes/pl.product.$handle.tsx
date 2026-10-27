import { createFileRoute, redirect, notFound, Link } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";
import { getProductRouteHead, canonicalizeHandle } from "@/lib/productSeo";
import { buildProductJsonLd } from "@/lib/productSchema";
import { loadProductSchemaData } from "@/lib/seoLoaders";
import { isPolishPilotHandle, isPolishPageReady } from "@/data/productCopyPl";
import Layout from "@/components/Layout";

export const Route = createFileRoute("/pl/product/$handle")({
  beforeLoad: ({ params }) => {
    const canonical = canonicalizeHandle(params.handle);
    // Only the five pilot products have a Polish page; everything else
    // belongs on the Swedish URL.
    if (!isPolishPilotHandle(canonical)) {
      throw redirect({
        to: "/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    if (canonical !== params.handle) {
      throw redirect({
        to: "/pl/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    return { pageLocale: "pl" as const };
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
      ...getProductRouteHead(params.handle, "pl", {
        // Stays out of the index until the Polish ingredient/nutrition/allergen
        // text has been manually reviewed and approved.
        noindex: !isPolishPageReady(params.handle),
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildProductJsonLd({
              handle: params.handle,
              locale: "pl",
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
  notFoundComponent: ProductNotFoundPl,
  component: ProductDetail,
});

function ProductNotFoundPl() {
  return (
    <Layout>
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-heading text-3xl font-bold">Nie znaleziono produktu</h1>
        <p className="text-muted-foreground">Ten adres już nie istnieje. Zobacz naszą ofertę.</p>
        <Link
          to="/pl/products"
          className="inline-block rounded-full border border-border px-6 py-2 hover:text-primary"
        >
          Zobacz produkty
        </Link>
      </div>
    </Layout>
  );
}
