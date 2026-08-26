import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";
import { buildCategoryHead } from "@/lib/categoryHead";

export const Route = createFileRoute("/halsosamma-snabbmaltider")({
  head: () => buildCategoryHead("healthy-instant-meals", "sv"),
  component: () => <CategoryPage categoryKey="healthy-instant-meals" />,
});
