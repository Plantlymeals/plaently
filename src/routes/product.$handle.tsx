import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";
import { getProductRouteHead, canonicalizeHandle } from "@/lib/productSeo";

export const Route = createFileRoute("/product/$handle")({
  // Legacy/aliased Shopify handles redirect to the single canonical URL so the
  // old handle never renders duplicate content.
  beforeLoad: ({ params }) => {
    const canonical = canonicalizeHandle(params.handle);
    if (canonical !== params.handle) {
      throw redirect({ to: "/product/$handle", params: { handle: canonical }, replace: true });
    }
  },
  head: ({ params }) => getProductRouteHead(params.handle),
  component: ProductDetail,
});
