import { createFileRoute } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Products";

export const Route = createFileRoute("/product/$handle")({
  component: ProductDetail,
});
