import { createFileRoute, redirect, notFound, Link } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";
import { getProductRouteHead, canonicalizeHandle } from "@/lib/productSeo";
import { buildProductJsonLd } from "@/lib/productSchema";
import { loadProductSchemaData } from "@/lib/seoLoaders";
import { isFinnishPilotHandle, isFinnishPageReady } from "@/data/productCopyFi";
import Layout from "@/components/Layout";

export const Route = createFileRoute("/fi/product/$handle")({
  beforeLoad: ({ params }) => {
    const canonical = canonicalizeHandle(params.handle);
    // Only the five pilot products have a Finnish page; everything else
    // belongs on the Swedish URL.
    if (!isFinnishPilotHandle(canonical)) {
      throw redirect({
        to: "/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    if (canonical !== params.handle) {
      throw redirect({
        to: "/fi/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    return { pageLocale: "fi" as const };
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
          { title: "Tuotetta ei löydy — PLÄNTLY" },
          { name: "robots", content: "noindex, follow" },
        ],
      };
    }
    return {
      ...getProductRouteHead(params.handle, "fi", {
        // Stays out of the index until the Finnish ingredient/nutrition/allergen
        // text has been manually reviewed and approved.
        noindex: !isFinnishPageReady(params.handle),
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildProductJsonLd({
              handle: params.handle,
              locale: "fi",
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
  notFoundComponent: ProductNotFoundFi,
  component: ProductDetail,
});

function ProductNotFoundFi() {
  return (
    <Layout>
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-heading text-3xl font-bold">Tuotetta ei löydy</h1>
        <p className="text-muted-foreground">Tätä osoitetta ei enää ole olemassa. Tutustu valikoimaamme.</p>
        <Link
          to="/fi/products"
          className="inline-block rounded-full border border-border px-6 py-2 hover:text-primary"
        >
          Katso tuotteet
        </Link>
      </div>
    </Layout>
  );
}
