import { useState } from "react";
import { Link } from "@/lib/router-compat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BLOG_CATEGORIES } from "@/data/blogCategories";
import MarketSelector from "@/components/MarketSelector";
import { openCookieSettings } from "@/lib/cookieConsent";
const logo = "/images/logo.png";

const Footer = () => {
  const { t, lang } = useTranslation();
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
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/70">{t("footer.explore")}</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: t("nav.products"), path: "/products" },
                { label: t("footer.highProtein"), path: "/high-protein-meals" },
                { label: t("footer.plantBased"), path: "/plant-based-meals" },
                { label: t("footer.instantMeals"), path: "/healthy-instant-meals" },
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
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/70">{t("footer.support")}</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: t("nav.faq"), path: "/faq" },
                { label: t("nav.contact"), path: "/contact" },
                { label: t("footer.shipping"), path: "/shipping" },
                { label: t("footer.privacy"), path: lang === "sv" ? "/integritetspolicy" : "/privacy-policy" },
                { label: t("footer.terms"), path: "/terms-of-service" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/70">{t("footer.stayUpdated")}</h3>
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
            <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-primary-foreground/70">{t("footer.categories")}</h3>
            <nav className="flex flex-wrap gap-x-4 gap-y-2">
              {BLOG_CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/blog/category/${c.slug}`} className="text-xs text-primary-foreground/60 hover:text-primary transition-colors">
                  {lang === "sv" ? c.sv : c.en}
                </Link>
              ))}
            </nav>
          </div>
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-primary-foreground/70">{t("footer.explore")}</h3>
            <nav className="flex flex-wrap gap-x-4 gap-y-2">
              {(lang === "sv"
                ? [
                    { label: "Proteinrika måltider", path: "/proteinrika-maltider" },
                    { label: "Plantbaserade måltider", path: "/plantbaserade-maltider" },
                    { label: "Hälsosamma snabbmåltider", path: "/halsosamma-snabbmaltider" },
                    { label: "Nyttig snabbmat", path: "/nyttig-snabbmat" },
                    { label: "Proteinkoppar", path: "/proteinkoppar" },
                  ]
                : [
                    { label: "High Protein Meals", path: "/high-protein-meals" },
                    { label: "Plant-Based Meals", path: "/plant-based-meals" },
                    { label: "Healthy Instant Meals", path: "/healthy-instant-meals" },
                    { label: "Healthy Fast Food", path: "/healthy-fast-food" },
                    { label: "Protein Cups", path: "/protein-cups" },
                  ]
              ).map((item) => (
                <Link key={item.path} to={item.path} className="text-xs text-primary-foreground/60 hover:text-primary transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>
          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-xs uppercase tracking-wider text-primary-foreground/70">{t("footer.flavoursPacks")}</h3>
            <nav className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                { label: "Fusilli Bolognese", path: "/product/plant-based-fusilli-bolognese" },
                { label: "Pasta Carbonara", path: "/product/plant-based-pasta-carbonara" },
                { label: "Smoky BBQ Lentils", path: "/product/plant-based-smoky-bbq-lentils" },
                { label: "Yellow Curry & Rice", path: "/product/plant-based-yellow-curry-rice" },
                { label: "Starter Pack", path: "/product/starter-pack-12-cups-1" },
                { label: "Monthly Box", path: "/product/monthly-box-24-cups" },
                { label: "Office Pack", path: "/product/office-pack-48-cups" },
                { label: "Big Office Pack", path: "/product/big-office-pack-96-cups" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-xs text-primary-foreground/60 hover:text-primary transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
         <p className="text-xs text-primary-foreground/70">© 2026 Plaently (PLÄNTLY) · plaently.com. {t("footer.rights")}</p>
          <div className="flex items-center gap-6">
            <MarketSelector variant="footer" />
            <a href="https://www.linkedin.com/company/111443346/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/70 hover:text-primary transition-colors">LinkedIn</a>
            <a href="https://www.instagram.com/plaently" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/70 hover:text-primary transition-colors">Instagram</a>
            <a href="https://www.tiktok.com/@plaently" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/70 hover:text-primary transition-colors">TikTok</a>
            <a href="https://www.facebook.com/plaently" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-foreground/70 hover:text-primary transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;