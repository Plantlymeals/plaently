import { createFileRoute } from "@tanstack/react-router";
import Lifestyle from "@/pages/Lifestyle";

export const Route = createFileRoute("/lifestyle")({
  component: Lifestyle,
});
