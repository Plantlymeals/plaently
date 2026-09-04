import { createFileRoute } from "@tanstack/react-router";
import Index, { HOME_SCHEMA } from "@/pages/Index";

const HOME_TITLE = "PLÄNTLY | Hälsosam snabbmat med 20g protein";
const HOME_DESCRIPTION = "Hälsosam snabbmat med 20g protein per portion — riktig mat, inget pulver. Klar på 5 minuter, bara tillsätt kokande vatten. Utvecklat i Sverige, hantverk från Italien.";
const HOME_URL = "https://plaently.com/";
const HOME_IMAGE = "https://plaently.com/images/hero-product.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:url", content: HOME_URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "sv_SE" },
      { property: "og:image", content: HOME_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
      { name: "twitter:image", content: HOME_IMAGE },
    ],
    links: [
      { rel: "canonical", href: HOME_URL },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(HOME_SCHEMA) }],
  }),
  component: Index,
});
