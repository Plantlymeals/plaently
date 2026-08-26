import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/healthy-fast-food")({
  head: () => buildCategoryHead("healthy-fast-food", "en"),
  component: () => <CategoryPage categoryKey="healthy-fast-food" />,
});
