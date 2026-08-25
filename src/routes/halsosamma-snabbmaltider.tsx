import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";

export const Route = createFileRoute("/halsosamma-snabbmaltider")({
  component: () => <CategoryPage categoryKey="healthy-instant-meals" />,
});
