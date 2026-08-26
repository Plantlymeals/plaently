import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/protein-cups")({
  head: () => buildCategoryHead("protein-cups", "en"),
  component: () => <CategoryPage categoryKey="protein-cups" />,
});
