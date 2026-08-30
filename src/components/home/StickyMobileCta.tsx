import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

/**
 * Fixed bottom CTA bar — mobile only (hidden from md breakpoint up).
 * Appears once the visitor has scrolled past the hero/first section.
 * Client-only: mounted after hydration in Layout, so SSR HTML is untouched.
 */
const StickyMobileCta = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold =
      document.querySelector("main section")?.getBoundingClientRect().height ?? 600;
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-background/95 backdrop-blur-lg border-t border-border/50 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3 animate-fade-up">
      <p className="text-sm font-semibold text-foreground whitespace-nowrap">
        {t("hero.fromPrice")}
      </p>
      <Button asChild className="rounded-full px-5 font-semibold shrink-0">
        <Link to="/product/starter-pack-12-cups-1">{t("hero.ctaStarter")}</Link>
      </Button>
    </div>
  );
};

export default StickyMobileCta;
