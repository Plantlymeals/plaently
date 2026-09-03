import { createFileRoute } from "@tanstack/react-router";
import Terms, { TERMS_SEO } from "@/pages/Terms";
import { buildStaticPageHead } from "@/lib/staticPageHead";

export const Route = createFileRoute("/kopsvillkor")({
  head: () =>
    buildStaticPageHead({
      lang: "sv",
      svPath: "/kopsvillkor",
      enPath: "/terms-of-service",
      noindex: true,
      ...TERMS_SEO.sv,
    }),
  component: () => <Terms routeLang="sv" />,
});
