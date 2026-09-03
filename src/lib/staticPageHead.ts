// SSR head metadata for static language-paired pages (shipping, terms).
// The route owns title, description, canonical and hreflang so crawlers see
// the correct language for the URL in the server HTML.
import type { Lang } from "@/lib/i18n";

const BASE_URL = "https://plaently.com";

export interface StaticPageHeadOptions {
  lang: Lang;
  svPath: string;
  enPath: string;
  title: string;
  description: string;
  noindex?: boolean;
}

export const buildStaticPageHead = ({
  lang,
  svPath,
  enPath,
  title,
  description,
  noindex = false,
}: StaticPageHeadOptions) => {
  const svUrl = `${BASE_URL}${svPath}`;
  const enUrl = `${BASE_URL}${enPath}`;
  const selfUrl = lang === "en" ? enUrl : svUrl;

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
      { rel: "alternate", hrefLang: "sv", href: svUrl },
      { rel: "alternate", hrefLang: "en", href: enUrl },
      { rel: "alternate", hrefLang: "x-default", href: svUrl },
    ],
  };
};
