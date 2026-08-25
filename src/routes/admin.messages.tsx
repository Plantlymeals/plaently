import { createFileRoute } from "@tanstack/react-router";
import AdminMessages from "@/pages/admin/AdminMessages";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessages,
});
