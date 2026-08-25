import { createFileRoute } from "@tanstack/react-router";
import Shipping from "@/pages/Shipping";

export const Route = createFileRoute("/frakt")({
  component: Shipping,
});
