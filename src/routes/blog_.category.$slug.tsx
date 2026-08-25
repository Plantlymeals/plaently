import { createFileRoute } from "@tanstack/react-router";
import BlogCategory from "@/pages/BlogCategory";

export const Route = createFileRoute("/blog_/category/$slug")({
  component: BlogCategory,
});
