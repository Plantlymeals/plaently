import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@/lib/router-compat";

// Redirects legacy /products/:slug to canonical /product/:slug so Google
// doesn't see two URL patterns for the same product page.
const LegacyProductRedirect = () => {
  const { slug } = Route.useParams();
  return <Navigate to={`/product/${slug ?? ""}`} replace />;
};

export const Route = createFileRoute("/products_/$slug")({
  component: LegacyProductRedirect,
});
