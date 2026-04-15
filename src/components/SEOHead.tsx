import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://plantlymeals.com";

const SEOHead = ({ title, description, path, image, type = "website" }: SEOHeadProps) => {
  const url = `${BASE_URL}${path}`;
  const ogImage = image || "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9e767189-eb55-4625-a33e-6e7fd5ef1e34/id-preview-0c6ffa32--e49a6c76-e3de-462b-a409-874125bebed1.lovable.app-1773245481620.png";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="PLÄNTLY" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEOHead;
