import { createFileRoute, redirect, notFound, Link } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";
import { getProductRouteHead, canonicalizeHandle } from "@/lib/productSeo";
import { buildProductJsonLd } from "@/lib/productSchema";
import { loadProductSchemaData } from "@/lib/seoLoaders";
import Layout from "@/components/Layout";

export const Route = createFileRoute("/product/$handle")({
  // Legacy/aliased Shopify handles redirect to the single canonical URL so the
  // old handle never renders duplicate content.
  beforeLoad: ({ params }) => {
    const canonical = canonicalizeHandle(params.handle);
    if (canonical !== params.handle) {
      throw redirect({
        to: "/product/$handle",
        params: { handle: canonical },
        replace: true,
        statusCode: 301,
      });
    }
  },
  loader: async ({ params }) => {
    const data = await loadProductSchemaData(canonicalizeHandle(params.handle));
    // Only a confirmed Shopify miss becomes a 404; a timeout or upstream error
    // must not de-index a real product page.
    if (data.confirmedMiss) throw notFound();
    return data;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Produkten hittades inte — PLÄNTLY" },
          { name: "robots", content: "noindex, follow" },
        ],
      };
    }
    return {
      ...getProductRouteHead(params.handle),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            buildProductJsonLd({
              handle: params.handle,
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
  notFoundComponent: ProductNotFound,
  component: ProductDetail,
});

function ProductNotFound() {
  return (
    <Layout>
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-heading text-3xl font-bold">Produkten hittades inte</h1>
        <p className="text-muted-foreground">Adressen finns inte längre. Se hela sortimentet nedan.</p>
        <Link
          to="/products"
          className="inline-block rounded-full border border-border px-6 py-2 hover:text-primary"
        >
          Till produkterna
        </Link>
      </div>
    </Layout>
  );
}
