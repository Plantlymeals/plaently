import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";
import { buildStaticPageHead } from "@/lib/staticPageHead";
import { tSv } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildStaticPageHead({
      lang: "sv",
      svPath: "/contact",
      title: tSv("seo.contact.title"),
      description: tSv("seo.contact.description"),
    }),
  component: Contact,
});
