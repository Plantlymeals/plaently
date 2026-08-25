import { createFileRoute } from "@tanstack/react-router";
import AdminDiscounts from "@/pages/admin/AdminDiscounts";

export const Route = createFileRoute("/admin/discounts")({
  component: AdminDiscounts,
});
