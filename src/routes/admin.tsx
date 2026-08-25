import { createFileRoute } from "@tanstack/react-router";
import ProtectedRoute from "@/components/ProtectedRoute";
import NoIndexHead from "@/components/NoIndexHead";
import AdminDashboard from "@/pages/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  component: () => (
    <ProtectedRoute>
      <NoIndexHead />
      <AdminDashboard />
    </ProtectedRoute>
  ),
});
