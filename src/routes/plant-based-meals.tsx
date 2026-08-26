import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/plant-based-meals")({
  head: () => buildCategoryHead("plant-based-meals", "en"),
  component: () => <CategoryPage categoryKey="plant-based-meals" />,
});
