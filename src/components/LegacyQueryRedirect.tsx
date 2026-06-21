import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Strips legacy WordPress-style query params (page_id, p, preview, replytocom)
// so Google doesn't index duplicate URLs like /?page_id=2.
// Strip legacy WordPress-style query params so Google doesn't index duplicate
// URLs like /?page_id=2, /?cat=1, /?p=1, /?feed=rss2 (seen in Search Console).
const LEGACY_PARAMS = ["page_id", "p", "preview", "replytocom", "cat", "feed", "m", "author"];

// Stale Shopify handles → corrected handles (cup counts reconciled to match CMS).
// Old indexed URLs (60/120/30 cups) now permanently redirect to the honest
// 48/96/24 cup URLs.
const HANDLE_REDIRECTS: Record<string, string> = {
  "office-pack-60-cups": "office-pack-48-cups",
  "big-office-pack-120-cups": "big-office-pack-96-cups",
  "monthly-box-30-cups": "monthly-box-24-cups",
};

const LegacyQueryRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Path-based handle redirects (run before query-strip).
    const productMatch = location.pathname.match(/^\/(product|products)\/([^/]+)\/?$/);
    if (productMatch) {
      const oldHandle = productMatch[2];
      const newHandle = HANDLE_REDIRECTS[oldHandle];
      if (newHandle) {
        navigate(`/product/${newHandle}${location.search}${location.hash}`, { replace: true });
        return;
      }
    }

    if (!location.search) return;
    const params = new URLSearchParams(location.search);
    let changed = false;
    for (const key of LEGACY_PARAMS) {
      if (params.has(key)) {
        params.delete(key);
        changed = true;
      }
    }
    if (changed) {
      const qs = params.toString();
      navigate(location.pathname + (qs ? `?${qs}` : "") + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default LegacyQueryRedirect;