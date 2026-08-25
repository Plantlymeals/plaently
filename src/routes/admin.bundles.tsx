import { createFileRoute } from "@tanstack/react-router";
import AdminBundles from "@/pages/admin/AdminBundles";

export const Route = createFileRoute("/admin/bundles")({
  component: AdminBundles,
});
