import { useState } from "react";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import { Link, useLocation } from "@/lib/router-compat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BLOG_CATEGORIES } from "@/data/blogCategories";
import MarketSelector from "@/components/MarketSelector";
import { openCookieSettings } from "@/lib/cookieConsent";
import { isEnglishPilotHandle } from "@/data/productCopyEn";
import { isGermanPilotHandle } from "@/data/productCopyDe";
const logo = "/images/logo.png";

const Footer = () => {
  const { t, lang } = useTranslation();
  const location = useLocation();
  const urlLocale: "sv" | "en" | "de" =
    location.pathname.startsWith("/en/") || location.pathname === "/en"
      ? "en"
      : location.pathname.startsWith("/de/") || location.pathname === "/de"
      ? "de"
      : "sv";
  // On unprefixed pages, follow the visitor's chosen language for localized links.
  const routeLocale: "sv" | "en" | "de" = urlLocale !== "sv" ? urlLocale : lang === "en" ? "en" : "sv";
  const prefix = routeLocale === "sv" ? "" : `/${routeLocale}`;
  const productsPath = `${prefix}/products`;
  const highProteinPath = routeLocale === "sv" ? "/proteinrika-maltider" : `${prefix}/high-protein-meals`;
  const plantBasedPath = routeLocale === "sv" ? "/plantbaserade-maltider" : `${prefix}/plant-based-meals`;
  const productsLabel = routeLocale === "de" ? "Produkte" : t("nav.products");
  const highProteinLabel = routeLocale === "de" ? "Proteinreiche Mahlzeiten" : t("footer.highProtein");
  const plantBasedLabel = routeLocale === "de" ? "Pflanzliche Mahlzeiten" : t("footer.plantBased");
  const productLinkPath = (handle: string) => {
    if (routeLocale === "en" && isEnglishPilotHandle(handle)) return `/en/product/${handle}`;
    if (routeLocale === "de" && isGermanPilotHandle(handle)) return `/de/product/${handle}`;
    return `/product/${handle}`;
  };
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim().toLowerCase() });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast.info(t("newsletter.alreadySubscribed"), { description: t("newsletter.alreadyDesc") });
      } else {
        toast.error(t("newsletter.error"), { description: t("newsletter.errorDesc") });
      }
      return;
    }
    toast.success(t("newsletter.success"), { description: t("newsletter.successDesc") });
    setEmail("");
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
           <img src={logo} alt="Plaently (PLÄNTLY)" className="h-8 brightness-0 invert" width={160} height={32} />
            <p className="text-sm text-primary-foreground/60 leading-relaxed">{t("footer.desc")}</p>
          </div>
          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/70">{t("footer.explore")}</h2>
            <nav className="flex flex-col gap-2">
              {[
                { label: productsLabel, path: productsPath },
                { label: highProteinLabel, path: highProteinPath },
                { label: plantBasedLabel, path: plantBasedPath },
                { label: t("nav.nutrition"), path: "/nutrition" },
                { label: t("nav.lifestyle"), path: "/lifestyle" },
                { label: t("nav.about"), path: "/about" },
                { label: t("nav.blog"), path: "/blog" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">{item.label}</Link>
              ))}
              <button
                type="button"
                onClick={openCookieSettings}
                className="text-sm text-left text-primary-foreground/60 hover:text-primary transition-colors"
              >
                {lang === "sv" ? "Cookie-inställningar" : "Cookie settings"}
              </button>
            </nav>
          </div>
          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/70">{t("footer.support")}</h2>
            <nav className="flex flex-col gap-2">
              {[
                { label: t("nav.faq"), path: "/faq" },
                { label: t("nav.contact"), path: "/contact" },
                { label: t("footer.shipping"), path: "/frakt" },
                { label: t("footer.privacy"), path: "/integritetspolicy" },
                { label: t("footer.terms"), path: "/kopsvillkor" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>
          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/70">{t("footer.stayUpdated")}</h2>
            <p className="text-sm text-primary-foreground/60">{t("footer.newsletterDesc")}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input type="email" aria-label={t("footer.emailPlaceholder")} placeholder={t("footer.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 rounded-full" />
              <Button type="submit" className="rounded-full px-5 shrink-0" disabled={loading}>{t("footer.join")}</Button>
            </form>
          </div>
        </div>

        {/* HTML sitemap — gives Googlebot a direct crawl path to every public landing page from any page on the site. */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h2 className="font-heading font-semibold text-xs uppercase tracking-wider text-primary-foreground/70">{t("footer.categories")}</h2>
            <nav className="flex flex-wrap gap-x-4 gap-y-2">
              {BLOG_CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/blog/category/${c.slug}`} className="text-xs text-primary-foreground/60 hover:text-primary transition-colors">
                  {lang === "sv" ? c.sv : c.en}
                </Link>
              ))}
            </nav>
          </div>
          <div className="space-y-3">
            <h2 className="font-heading font-semibold text-xs uppercase tracking-wider text-primary-foreground/70">{t("footer.explore")}</h2>
            <nav className="flex flex-wrap gap-x-4 gap-y-2">
              {(routeLocale === "de"
                ? [
                    { label: "Proteinreiche Mahlzeiten", path: "/de/high-protein-meals" },
                    { label: "Pflanzliche Mahlzeiten", path: "/de/plant-based-meals" },
                    { label: "Gesundes Fast Food", path: "/de/healthy-fast-food" },
                    { label: "Proteinbecher", path: "/de/protein-cups" },
                  ]
                : routeLocale === "en"
                ? [
                    { label: "High Protein Meals", path: "/en/high-protein-meals" },
                    { label: "Plant-Based Meals", path: "/en/plant-based-meals" },
                    { label: "Healthy Fast Food", path: "/en/healthy-fast-food" },
                    { label: "Protein Cups", path: "/en/protein-cups" },
                  ]
                : [
                    { label: "Proteinrika måltider", path: "/proteinrika-maltider" },
                    { label: "Plantbaserade måltider", path: "/plantbaserade-maltider" },
                    { label: "Nyttig snabbmat", path: "/nyttig-snabbmat" },
                    { label: "Proteinkoppar", path: "/proteinkoppar" },
                  ]
              ).map((item) => (
                <Link key={item.path} to={item.path} className="text-xs text-primary-foreground/60 hover:text-primary transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>
          <div className="space-y-3">
            <h2 className="font-heading font-semibold text-xs uppercase tracking-wider text-primary-foreground/70">{t("footer.flavoursPacks")}</h2>
            <nav className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                { label: "Bolognese Box", path: "/product/bolognese-box-12-cups" },
                { label: "Carbonara Box", path: "/product/carbonara-box-12-cups" },
                { label: "Smoky Lentils Box", path: "/product/smoky-lentils-box-12-cups" },
                { label: "Yellow Curry Box", path: "/product/yellow-curry-box-12-cups" },
                { label: "Starter Pack", path: "/product/starter-pack-12-cups-1" },
                { label: "Monthly Box", path: "/product/monthly-box-24-cups" },
                { label: "Office Pack", path: "/product/office-pack-48-cups" },
                { label: "Big Office Pack", path: "/product/big-office-pack-96-cups" },
              ].map((item) => (
                <Link key={item.path} to={productLinkPath(item.path.replace("/product/", ""))} className="text-xs text-primary-foreground/60 hover:text-primary transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
         <p className="text-xs text-primary-foreground/70">© 2026 Plaently (PLÄNTLY) · plaently.com. {t("footer.rights")}</p>
          <div className="flex items-center gap-6">
            <MarketSelector variant="footer" />
            <a href="https://www.linkedin.com/company/111443346/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-primary-foreground/70 hover:text-primary transition-colors">
              <Linkedin className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/plaently" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-primary-foreground/70 hover:text-primary transition-colors">
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="https://www.tiktok.com/@plaently" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-primary-foreground/70 hover:text-primary transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M9 12a4 4 0 1 0 4 4V2a5 5 0 0 0 5 5" />
              </svg>
            </a>
            <a href="https://www.facebook.com/plaently" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-primary-foreground/70 hover:text-primary transition-colors">
              <Facebook className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;