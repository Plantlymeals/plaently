import { Helmet } from "react-helmet-async";
import { useLocation } from "@/lib/router-compat";
import { getAlternates, normalizePath } from "@/lib/localeAlternates";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  locale?: "sv" | "en";
  alternates?: { hreflang: string; path: string }[];
  /** Swedish title/description used for OG + Twitter cards (falls back to title/description). */
  ogTitle?: string;
  ogDescription?: string;
  /** Utility/legal pages: keep links followed but out of the index. */
  noindex?: boolean;
}

const BASE_URL = "https://plaently.com";

const KEYWORDS = {
  sv: "växtbaserade proteinmåltider, proteinmåltider, hälsosam snabbmat, 20g växtprotein, nyttig snabbmat Sverige, instant proteinmåltid, plant-based protein meals, PLÄNTLY, snabb proteinrik mat, växtprotein måltid, proteinmåltid 5 minuter, nyttig lunch kontor",
  en: "plant-based protein meals, protein meals, healthy fast food, 20g plant protein, instant protein meal Sweden, PLÄNTLY, quick protein food, plant protein meal, protein meal 5 minutes, healthy office lunch",
} as const;

const SEOHead = ({ title, description, path, image, type = "website", jsonLd, locale = "sv", alternates, ogTitle, ogDescription, noindex }: SEOHeadProps) => {
  const { pathname } = useLocation();
  // Canonical always self-references the URL actually being visited, so a
  // language toggle can never point two URLs at the same canonical.
  const canonicalPath = normalizePath(pathname || path);
  const url = `${BASE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const hreflangs = alternates ?? getAlternates(canonicalPath);
  const ogImage = image || "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9e767189-eb55-4625-a33e-6e7fd5ef1e34/id-preview-0c6ffa32--e49a6c76-e3de-462b-a409-874125bebed1.lovable.app-1773245481620.png";
  const ogLocale = locale === "en" ? "en_GB" : "sv_SE";
  const socialTitle = ogTitle || title;
  const socialDescription = ogDescription || description;

  return (
    <Helmet>
      <html lang={locale} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={KEYWORDS[locale]} />
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
      <link rel="canonical" href={url} />
      {hreflangs.map((a) => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={`${BASE_URL}${a.path}`} />
      ))}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="PLÄNTLY" />
      <meta property="og:locale" content={ogLocale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@plaently" />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLd
        ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((schema, i) => (
            <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
          ))
        : null}
    </Helmet>
  );
};

export default SEOHead;
