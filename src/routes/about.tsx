import { createFileRoute } from "@tanstack/react-router";
import About from "@/pages/About";
import { buildStaticPageHead } from "@/lib/staticPageHead";
import { tSv } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () =>
    buildStaticPageHead({
      lang: "sv",
      svPath: "/about",
      title: tSv("seo.about.title"),
      description: tSv("seo.about.description"),
    }),
  component: About,
});
