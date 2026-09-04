import { createFileRoute } from "@tanstack/react-router";
import Shipping, { SHIPPING_SEO } from "@/pages/Shipping";
import { buildStaticPageHead } from "@/lib/staticPageHead";

export const Route = createFileRoute("/frakt")({
  head: () =>
    buildStaticPageHead({
      lang: "sv",
      svPath: "/frakt",
      ...SHIPPING_SEO.sv,
    }),
  component: () => <Shipping routeLang="sv" />,
});
