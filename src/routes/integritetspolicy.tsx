import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import { buildStaticPageHead } from "@/lib/staticPageHead";

export const Route = createFileRoute("/integritetspolicy")({
  head: () =>
    buildStaticPageHead({
      lang: "sv",
      svPath: "/integritetspolicy",
      noindex: true,
      title: "Integritetspolicy — PLÄNTLY AB | Org.nr SE559400472201",
      description: "Hur PLÄNTLY AB hanterar dina personuppgifter i enlighet med GDPR och svensk lag.",
    }),
  component: PrivacyPolicy,
});
