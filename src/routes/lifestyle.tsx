import { createFileRoute } from "@tanstack/react-router";
import Lifestyle from "@/pages/Lifestyle";
import { buildStaticPageHead } from "@/lib/staticPageHead";
import { tSv } from "@/lib/i18n";

export const Route = createFileRoute("/lifestyle")({
  head: () =>
    buildStaticPageHead({
      lang: "sv",
      svPath: "/lifestyle",
      title: tSv("seo.lifestyle.title"),
      description: tSv("seo.lifestyle.description"),
    }),
  component: Lifestyle,
});
