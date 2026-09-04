import { Helmet } from "react-helmet-async";
import { useLocation } from "@/lib/router-compat";
import { normalizePath } from "@/lib/normalizePath";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string | undefined;
  type?: string | undefined;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[] | undefined;
  locale?: "sv" | "en" | undefined;
  /** Swedish title/description used for OG + Twitter cards (falls back to title/description). */
  ogTitle?: string | undefined;
  ogDescription?: string | undefined;
  /** Utility/legal pages: keep links followed but out of the index. */
  noindex?: boolean | undefined;
  /** Route head already owns canonical/hreflang for SSR-first dynamic pages. */
  routeOwnsLinks?: boolean | undefined;
  /** Route head already owns all basic metadata; Helmet only contributes JSON-LD. */
  routeOwnsMetadata?: boolean | undefined;
}

const BASE_URL = "https://plaently.com";

const KEYWORDS = {
  sv: "växtbaserade proteinmåltider, proteinmåltider, hälsosam snabbmat, 20g växtprotein, nyttig snabbmat Sverige, instant proteinmåltid, plant-based protein meals, PLÄNTLY, snabb proteinrik mat, växtprotein måltid, proteinmåltid 5 minuter, nyttig lunch kontor",
  en: "plant-based protein meals, protein meals, healthy fast food, 20g plant protein, instant protein meal Sweden, PLÄNTLY, quick protein food, plant protein meal, protein meal 5 minutes, healthy office lunch",
} as const;

const SEOHead = ({ title, description, path, image, type = "website", jsonLd, locale = "sv", ogTitle, ogDescription, noindex, routeOwnsLinks = false, routeOwnsMetadata = false }: SEOHeadProps) => {
  const { pathname } = useLocation();
  // Canonical always self-references the URL actually being visited. Every page
  // has exactly one Swedish URL, so no hreflang alternates are emitted.
  const canonicalPath = normalizePath(pathname || path);
  const url = `${BASE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const ogImage = image || "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9e767189-eb55-4625-a33e-6e7fd5ef1e34/id-preview-0c6ffa32--e49a6c76-e3de-462b-a409-874125bebed1.lovable.app-1773245481620.png";
  const ogLocale = locale === "en" ? "en_GB" : "sv_SE";
  const socialTitle = ogTitle || title;
  const socialDescription = ogDescription || description;

  return (
    <Helmet>
      {/* html lang always follows the page locale, even when the route owns the rest. */}
      <html lang={locale} />
      {!routeOwnsMetadata && <title>{title}</title>}
      {!routeOwnsMetadata && <meta name="description" content={description} />}
      {!routeOwnsMetadata && <meta name="keywords" content={KEYWORDS[locale]} />}
      {!routeOwnsMetadata && <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />}
      {!routeOwnsLinks && <link rel="canonical" href={url} />}
      {!routeOwnsMetadata && <meta property="og:title" content={socialTitle} />}
      {!routeOwnsMetadata && <meta property="og:description" content={socialDescription} />}
      {!routeOwnsMetadata && <meta property="og:url" content={url} />}
      {!routeOwnsMetadata && <meta property="og:type" content={type} />}
      {!routeOwnsMetadata && <meta property="og:image" content={ogImage} />}
      {!routeOwnsMetadata && <meta property="og:image:width" content="1200" />}
      {!routeOwnsMetadata && <meta property="og:image:height" content="630" />}
      {!routeOwnsMetadata && <meta property="og:site_name" content="PLÄNTLY" />}
      {!routeOwnsMetadata && <meta property="og:locale" content={ogLocale} />}
      {!routeOwnsMetadata && <meta name="twitter:card" content="summary_large_image" />}
      {!routeOwnsMetadata && <meta name="twitter:site" content="@plaently" />}
      {!routeOwnsMetadata && <meta name="twitter:title" content={socialTitle} />}
      {!routeOwnsMetadata && <meta name="twitter:description" content={socialDescription} />}
      {!routeOwnsMetadata && <meta name="twitter:image" content={ogImage} />}
      {jsonLd
        ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((schema, i) => (
            <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
          ))
        : null}
    </Helmet>
  );
};

export default SEOHead;
