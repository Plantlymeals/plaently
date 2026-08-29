import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";
import { getProductRouteHead, canonicalizeHandle } from "@/lib/productSeo";
import { buildProductJsonLd } from "@/lib/productSchema";
import { loadProductSchemaData } from "@/lib/seoLoaders";

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
  loader: ({ params }) => loadProductSchemaData(canonicalizeHandle(params.handle)),
  head: ({ params, loaderData }) => ({
    ...getProductRouteHead(params.handle),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          buildProductJsonLd({
            handle: params.handle,
            offer: loaderData?.offer ?? null,
            rating: loaderData?.rating ?? null,
            shopifyImageUrl: loaderData?.shopifyImageUrl ?? null,
            name: loaderData?.name ?? null,
            description: loaderData?.description ?? null,
          })
        ),
      },
    ],
  }),
  component: ProductDetail,
});
