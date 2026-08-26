import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/proteinkoppar")({
  head: () => buildCategoryHead("protein-cups", "sv"),
  component: () => <CategoryPage categoryKey="protein-cups" />,
});
