import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resolveLegacyRedirect } from "@/lib/legacyRedirects";

// Strips legacy WordPress-style query params so Google doesn't index duplicate
// URLs like /?page_id=2, /?cat=1, /?p=1, /?feed=rss2 (seen in Search Console),
// and folds legacy/duplicate paths into their primary URL.
const LEGACY_PARAMS = ["page_id", "p", "preview", "replytocom", "cat", "feed", "m", "author"];

const LegacyQueryRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Path-based redirects (legacy aliases + stale product handles) run first.
    const primary = resolveLegacyRedirect(location.pathname);
    if (primary) {
      navigate(`${primary}${location.search}${location.hash}`, { replace: true });
      return;
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
