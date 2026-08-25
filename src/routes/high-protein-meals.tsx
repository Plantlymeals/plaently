import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";

export const Route = createFileRoute("/high-protein-meals")({
  component: () => <CategoryPage categoryKey="high-protein-meals" />,
});
