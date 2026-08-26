import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/high-protein-meals")({
  head: () => buildCategoryHead("high-protein-meals", "en"),
  component: () => <CategoryPage categoryKey="high-protein-meals" />,
});
