import { createFileRoute } from "@tanstack/react-router";
import Nutrition from "@/pages/Nutrition";
import { buildStaticPageHead } from "@/lib/staticPageHead";
import { tSv } from "@/lib/i18n";

export const Route = createFileRoute("/nutrition")({
  head: () =>
    buildStaticPageHead({
      lang: "sv",
      svPath: "/nutrition",
      title: tSv("seo.nutrition.title"),
      description: tSv("seo.nutrition.description"),
    }),
  component: Nutrition,
});
