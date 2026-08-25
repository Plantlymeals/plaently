import { createFileRoute } from "@tanstack/react-router";
import NoIndexHead from "@/components/NoIndexHead";
import AdminLogin from "@/pages/admin/AdminLogin";

export const Route = createFileRoute("/admin_/login")({
  component: () => (
    <>
      <NoIndexHead />
      <AdminLogin />
    </>
  ),
});
