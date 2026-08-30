import { useEffect, useState } from "react";
import { useLocation } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

/**
 * Fixed bottom CTA bar — homepage only, small phones only (hidden from sm up).
 * Appears once the visitor has scrolled past the hero/first section and
 * smooth-scrolls to the bundles section (#paket).
 * Client-only: mounted after hydration in Layout, so SSR HTML is untouched.
 */
const StickyMobileCta = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const isHome = pathname === "/" || pathname === "/index";

  useEffect(() => {
    if (!isHome) return;
    const threshold =
      document.querySelector("main section")?.getBoundingClientRect().height ?? 600;
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  if (!isHome || !visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-background/95 backdrop-blur-lg border-t border-border/50 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3 animate-fade-up">
      <p className="text-sm font-semibold text-foreground whitespace-nowrap">
        {t("hero.fromPrice")}
      </p>
      <Button
        className="rounded-full px-5 font-semibold shrink-0"
        onClick={() =>
          document.getElementById("paket")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        {t("ps.ctaBundles")}
      </Button>
    </div>
  );
};

export default StickyMobileCta;
