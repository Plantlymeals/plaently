import { createFileRoute } from "@tanstack/react-router";
import AdminHero from "@/pages/admin/AdminHero";

export const Route = createFileRoute("/admin/hero")({
  component: AdminHero,
});
