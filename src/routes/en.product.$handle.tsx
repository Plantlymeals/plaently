import { createFileRoute, redirect, notFound, Link } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";
import { getProductRouteHead, canonicalizeHandle } from "@/lib/productSeo";
import { buildProductJsonLd } from "@/lib/productSchema";
import { loadProductSchemaData } from "@/lib/seoLoaders";
import { isEnglishPilotHandle, isEnglishPageReady } from "@/data/productCopyEn";
import Layout from "@/components/Layout";

export const Route = createFileRoute("/en/product/$handle")({
  beforeLoad: ({ params }) => {
    const canonical = canonicalizeHandle(params.handle);
    // Only the five pilot products have an English page; everything else
    // belongs on the Swedish URL.
    if (!isEnglishPilotHandle(canonical)) {
      throw redirect({
        to: "/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    if (canonical !== params.handle) {
      throw redirect({
        to: "/en/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
    return { pageLocale: "en" as const };
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
          { title: "Product not found — PLÄNTLY" },
          { name: "robots", content: "noindex, follow" },
        ],
      };
    }
    return {
      ...getProductRouteHead(params.handle, "en", {
        // Stays out of the index until the English allergen/nutrition text has
        // been manually reviewed and approved.
        noindex: !hasApprovedEnCopy(params.handle),
        hasEnglishAlternate: true,
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildProductJsonLd({
              handle: params.handle,
              locale: "en",
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
  notFoundComponent: ProductNotFoundEn,
  component: ProductDetail,
});

function ProductNotFoundEn() {
  return (
    <Layout>
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-heading text-3xl font-bold">Product not found</h1>
        <p className="text-muted-foreground">This address no longer exists. See the full range below.</p>
        <Link
          to="/products"
          className="inline-block rounded-full border border-border px-6 py-2 hover:text-primary"
        >
          To the products
        </Link>
      </div>
    </Layout>
  );
}
