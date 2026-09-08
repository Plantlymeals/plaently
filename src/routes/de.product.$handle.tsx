import { createFileRoute, redirect, notFound, Link } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";
import { getProductRouteHead, canonicalizeHandle } from "@/lib/productSeo";
import { buildProductJsonLd } from "@/lib/productSchema";
import { loadProductSchemaData } from "@/lib/seoLoaders";
import { isGermanPilotHandle, isGermanPageReady } from "@/data/productCopyDe";
import Layout from "@/components/Layout";

export const Route = createFileRoute("/de/product/$handle")({
  beforeLoad: ({ params }) => {
    const canonical = canonicalizeHandle(params.handle);
    // Only the five pilot products have a German page; everything else
    // belongs on the Swedish URL.
    if (!isGermanPilotHandle(canonical)) {
      throw redirect({
        to: "/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    if (canonical !== params.handle) {
      throw redirect({
        to: "/de/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    return { pageLocale: "de" as const };
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
          { title: "Produkt nicht gefunden — PLÄNTLY" },
          { name: "robots", content: "noindex, follow" },
        ],
      };
    }
    return {
      ...getProductRouteHead(params.handle, "de", {
        // Stays out of the index until the German ingredient/nutrition/allergen
        // text has been manually reviewed and approved.
        noindex: !isGermanPageReady(params.handle),
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildProductJsonLd({
              handle: params.handle,
              locale: "de",
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
  notFoundComponent: ProductNotFoundDe,
  component: ProductDetail,
});

function ProductNotFoundDe() {
  return (
    <Layout>
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-heading text-3xl font-bold">Produkt nicht gefunden</h1>
        <p className="text-muted-foreground">Diese Adresse existiert nicht mehr. Sieh dir unsere Auswahl an.</p>
        <Link
          to="/products"
          className="inline-block rounded-full border border-border px-6 py-2 hover:text-primary"
        >
          Zu den Produkten
        </Link>
      </div>
    </Layout>
  );
}
