import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
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
}

const BASE_URL = "https://plaently.com";

const SEOHead = ({ title, description, path, image, type = "website", jsonLd, locale = "sv", alternates }: SEOHeadProps) => {
  const { pathname } = useLocation();
  // Canonical always self-references the URL actually being visited, so a
  // language toggle can never point two URLs at the same canonical.
  const canonicalPath = normalizePath(pathname || path);
  const url = `${BASE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const hreflangs = alternates ?? getAlternates(canonicalPath);
  const ogImage = image || "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9e767189-eb55-4625-a33e-6e7fd5ef1e34/id-preview-0c6ffa32--e49a6c76-e3de-462b-a409-874125bebed1.lovable.app-1773245481620.png";
  const ogLocale = locale === "en" ? "en_GB" : "sv_SE";

  return (
    <Helmet>
      <html lang={locale} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {hreflangs.map((a) => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={`${BASE_URL}${a.path}`} />
      ))}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="PLÄNTLY" />
      <meta property="og:locale" content={ogLocale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
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
