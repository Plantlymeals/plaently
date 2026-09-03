import { createFileRoute } from "@tanstack/react-router";
import Terms, { TERMS_SEO } from "@/pages/Terms";
import { buildStaticPageHead } from "@/lib/staticPageHead";

export const Route = createFileRoute("/terms-of-service")({
  head: () =>
    buildStaticPageHead({
      lang: "en",
      svPath: "/kopsvillkor",
      enPath: "/terms-of-service",
      noindex: true,
      ...TERMS_SEO.en,
    }),
  component: () => <Terms routeLang="en" />,
});
