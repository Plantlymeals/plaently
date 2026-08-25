import { createFileRoute } from "@tanstack/react-router";
import CategoryPage from "@/pages/categories/CategoryPage";

export const Route = createFileRoute("/nyttig-snabbmat")({
  component: () => <CategoryPage categoryKey="healthy-fast-food" />,
});
