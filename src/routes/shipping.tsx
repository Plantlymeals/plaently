import { createFileRoute } from "@tanstack/react-router";
import Shipping, { SHIPPING_SEO } from "@/pages/Shipping";
import { buildStaticPageHead } from "@/lib/staticPageHead";

export const Route = createFileRoute("/shipping")({
  head: () =>
    buildStaticPageHead({
      lang: "en",
      svPath: "/frakt",
      enPath: "/shipping",
      ...SHIPPING_SEO.en,
    }),
  component: () => <Shipping routeLang="en" />,
});
