import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/plantbaserade-maltider")({
  head: () => buildCategoryHead("plant-based-meals", "sv"),
  component: () => <CategoryPage categoryKey="plant-based-meals" routeLang="sv" />,
});
