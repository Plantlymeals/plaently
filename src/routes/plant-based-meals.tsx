import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";

export const Route = createFileRoute("/plant-based-meals")({
  component: () => <CategoryPage categoryKey="plant-based-meals" />,
});
