import { createFileRoute } from "@tanstack/react-router";
import Blog from "@/pages/Blog";
import { getBlogPosts } from "@/lib/blog.functions";

const TITLE = "Blogg | Protein, Hälsa & Växtbaserad Mat — PLÄNTLY";
const DESCRIPTION =
  "Tips och inspiration om växtbaserat protein, hälsosam snabbmat och hur du äter bättre utan att kompromissa med tid eller smak.";
const URL = "https://plaently.com/blog";
const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9e767189-eb55-4625-a33e-6e7fd5ef1e34/id-preview-0c6ffa32--e49a6c76-e3de-462b-a409-874125bebed1.lovable.app-1773245481620.png";

export const Route = createFileRoute("/blog")({
  loader: () => getBlogPosts({ data: { language: "sv" } }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "sv_SE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hrefLang: "sv", href: URL },
      { rel: "alternate", hrefLang: "en", href: URL },
      { rel: "alternate", hrefLang: "x-default", href: URL },
    ],
  }),
  component: Blog,
});
