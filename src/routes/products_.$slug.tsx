import { createFileRoute, redirect } from "@tanstack/react-router";
import { canonicalizeHandle } from "@/lib/productSeo";

// Legacy /products/:slug → canonical /product/:handle as a real server-side
// 301 (the previous client-side <Navigate> never emitted a Location header).
export const Route = createFileRoute("/products_/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/product/$handle",
      params: { handle: canonicalizeHandle(params.slug ?? "") },
      replace: true,
      statusCode: 301,
    });
  },
  component: () => null,
});
