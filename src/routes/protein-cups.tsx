import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";

export const Route = createFileRoute("/protein-cups")({
  component: () => <CategoryPage categoryKey="protein-cups" />,
});
