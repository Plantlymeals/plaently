import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/proteinrika-maltider")({
  head: () => buildCategoryHead("high-protein-meals", "sv"),
  component: () => <CategoryPage categoryKey="high-protein-meals" />,
});
