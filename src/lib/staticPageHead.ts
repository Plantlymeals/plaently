// SSR head metadata for the static policy pages (frakt, köpvillkor).
// The route owns title, description and canonical so crawlers see them in the
// server HTML.
import type { Lang } from "@/lib/i18n";

const BASE_URL = "https://plaently.com";

export interface StaticPageHeadOptions {
  lang: Lang;
  svPath: string;
  title: string;
  description: string;
  noindex?: boolean;
}

export const buildStaticPageHead = ({
  lang,
  svPath,
  title,
  description,
  noindex = false,
}: StaticPageHeadOptions) => {
  const selfUrl = `${BASE_URL}${svPath}`;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: noindex ? "noindex, follow" : "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: selfUrl },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: lang === "en" ? "en_GB" : "sv_SE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [
      { rel: "canonical", href: selfUrl },
    ],
  };
};
