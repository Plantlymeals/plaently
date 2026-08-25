import { Helmet } from "react-helmet-async";
import { useLocation } from "@/lib/router-compat";
import { normalizePath } from "@/lib/localeAlternates";

const BASE_URL = "https://plaently.com";

/**
 * Self-referencing canonical for utility routes (admin, 404, OAuth consent).
 * These should never be indexed, but still need a clean https, non-www canonical.
 */
const NoIndexHead = ({ title }: { title?: string }) => {
  const { pathname } = useLocation();
  const path = normalizePath(pathname);
  const url = `${BASE_URL}${path === "/" ? "/" : path}`;

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      <link rel="canonical" href={url} />
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
};

export default NoIndexHead;
