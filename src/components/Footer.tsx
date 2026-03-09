import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <img src={logo} alt="PLÄNTLY" className="h-7 brightness-0 invert" />
            <p className="text-sm text-primary-foreground/60 leading-relaxed">{t("footer.desc")}</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">{t("footer.explore")}</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: t("nav.products"), path: "/products" },
                { label: t("nav.nutrition"), path: "/nutrition" },
                { label: t("nav.lifestyle"), path: "/lifestyle" },
                { label: t("nav.about"), path: "/about" },
                { label: t("nav.blog"), path: "/blog" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">{t("footer.support")}</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: t("nav.faq"), path: "/faq" },
                { label: t("nav.contact"), path: "/contact" },
                { label: t("footer.shipping"), path: "/shipping" },
                { label: t("footer.privacy"), path: "/privacy-policy" },
                { label: t("footer.terms"), path: "/terms-of-service" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">{item.label}</Link>
              ))}
            </nav>
          </div>
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">{t("footer.stayUpdated")}</h4>
            <p className="text-sm text-primary-foreground/60">{t("footer.newsletterDesc")}</p>
            <div className="flex gap-2">
              <Input placeholder={t("footer.emailPlaceholder")} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 rounded-full" />
              <Button className="rounded-full px-5 shrink-0">{t("footer.join")}</Button>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">© 2026 PLÄNTLY. {t("footer.rights")}</p>
          <div className="flex gap-6">
            {["LinkedIn", "Instagram", "TikTok", "Facebook"].map((social) => (
              <a key={social} href="#" className="text-xs text-primary-foreground/40 hover:text-primary transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
