import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/de/protein-cups")({
  head: () => buildCategoryHead("protein-cups", "de"),
  component: () => <CategoryPage categoryKey="protein-cups" routeLang="de" />,
});
