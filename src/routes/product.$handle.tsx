import { createFileRoute } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";
import { getProductRouteHead } from "@/lib/productSeo";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => getProductRouteHead(params.handle),
  component: ProductDetail,
});
