import { createFileRoute } from "@tanstack/react-router";
import AdminSEO from "@/pages/admin/AdminSEO";

export const Route = createFileRoute("/admin/seo")({
  component: AdminSEO,
});
