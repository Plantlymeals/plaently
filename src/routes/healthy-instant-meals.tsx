import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/healthy-instant-meals")({
  head: () => buildCategoryHead("healthy-instant-meals", "en"),
  component: () => <CategoryPage categoryKey="healthy-instant-meals" />,
});
