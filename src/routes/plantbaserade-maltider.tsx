import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";

export const Route = createFileRoute("/plantbaserade-maltider")({
  component: () => <CategoryPage categoryKey="plant-based-meals" />,
});
