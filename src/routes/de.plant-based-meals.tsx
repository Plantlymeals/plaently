import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/de/plant-based-meals")({
  head: () => buildCategoryHead("plant-based-meals", "de"),
  component: () => <CategoryPage categoryKey="plant-based-meals" routeLang="de" />,
});
