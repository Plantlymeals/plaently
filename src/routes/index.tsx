import { createFileRoute } from "@tanstack/react-router";
import Index, { HOME_SCHEMA } from "@/pages/Index";

const HOME_TITLE = "PLÄNTLY — Riktig mat med 20g protein | Klart på 5 minuter";
const HOME_DESCRIPTION = "Riktiga måltider med 20g protein — inget pulver, ingen shake. Bara riktig mat klar på 5 minuter. Utvecklat i Sverige, hantverk från Italien.";
const HOME_URL = "https://plaently.com/";

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
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: HOME_URL },
      { rel: "alternate", hrefLang: "sv", href: HOME_URL },
      { rel: "alternate", hrefLang: "en", href: HOME_URL },
      { rel: "alternate", hrefLang: "x-default", href: HOME_URL },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(HOME_SCHEMA) }],
  }),
  component: Index,
});
