// SSR head metadata for the category landing pages. Route head() owns title,
// description, canonical, hreflang and the FAQPage schema so crawlers see them
// in the server HTML; SEOHead only refines OG/Twitter on the client.
import { getCategoryContent, enSlugByKey, svSlugByKey, type CategoryKey } from "@/data/categoryContent";
import type { Lang } from "@/lib/i18n";

const BASE_URL = "https://plaently.com";

export const buildCategoryHead = (key: CategoryKey, lang: Lang) => {
  const c = getCategoryContent(key, lang);
  const svUrl = `${BASE_URL}/${svSlugByKey[key]}`;
  const enUrl = `${BASE_URL}/${enSlugByKey[key]}`;
  const selfUrl = lang === "en" ? enUrl : svUrl;

  const faqSchema = c.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: c.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return {
    meta: [
      { title: c.metaTitle },
      { name: "description", content: c.metaDescription },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: c.metaTitle },
      { property: "og:description", content: c.metaDescription },
      { property: "og:url", content: selfUrl },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: lang === "en" ? "en_GB" : "sv_SE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: c.metaTitle },
      { name: "twitter:description", content: c.metaDescription },
    ],
    links: [
      { rel: "canonical", href: selfUrl },
    ],
    ...(faqSchema
      ? { scripts: [{ type: "application/ld+json", children: JSON.stringify(faqSchema) }] }
      : {}),
  };
};
