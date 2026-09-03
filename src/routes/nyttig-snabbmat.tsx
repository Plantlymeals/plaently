import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/nyttig-snabbmat")({
  head: () => buildCategoryHead("healthy-fast-food", "sv"),
  component: () => <CategoryPage categoryKey="healthy-fast-food" routeLang="sv" />,
});
