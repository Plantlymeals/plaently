import { createFileRoute } from "@tanstack/react-router";
import AdminFAQs from "@/pages/admin/AdminFAQs";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFAQs,
});
