import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";

export const Route = createFileRoute("/healthy-instant-meals")({
  component: () => <CategoryPage categoryKey="healthy-instant-meals" />,
});
