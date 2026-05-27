import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { useTranslation } from "@/lib/i18n";
const logo = "/images/logo.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { lang, t, setLang } = useTranslation();

  const navItems = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.products"), path: "/products" },
    { label: t("nav.howItWorks"), path: "/#how-it-works" },
    { label: t("nav.nutrition"), path: "/nutrition" },
    { label: t("nav.lifestyle"), path: "/lifestyle" },
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.blog"), path: "/blog" },
    { label: t("nav.faq"), path: "/faq" },
    { label: t("nav.contact"), path: "/contact" },
  ];

  const toggleLang = () => setLang(lang === "sv" ? "en" : "sv");

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="PLÄNTLY" className="h-8" width={160} height={32} fetchPriority="high" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isHash = item.path.includes("#");
            const handleClick = (e: React.MouseEvent) => {
              if (isHash && location.pathname === "/") {
                e.preventDefault();
                const hash = item.path.split("#")[1];
                const el = document.getElementById(hash);
                el?.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", item.path);
              }
            };
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleClick}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:text-primary hover:bg-primary/5 ${
                  location.pathname === item.path ? "text-primary bg-primary/5" : "text-foreground/70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border/50 hover:bg-muted transition-colors"
            aria-label="Switch language"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "sv" ? "EN" : "SE"}
          </button>
          <CartDrawer />
          <Button asChild className="hidden sm:inline-flex rounded-full px-6 font-semibold">
            <Link to="/products">{t("nav.shopNow")}</Link>
          </Button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Öppna meny"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg animate-fade-up">
          <nav className="container py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const isHash = item.path.includes("#");
              const handleMobileClick = (e: React.MouseEvent) => {
                setMobileOpen(false);
                if (isHash && location.pathname === "/") {
                  e.preventDefault();
                  const hash = item.path.split("#")[1];
                  setTimeout(() => {
                    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                  window.history.pushState(null, "", item.path);
                }
              };
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleMobileClick}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary ${
                    location.pathname === item.path ? "text-primary bg-primary/5" : "text-foreground/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button asChild className="mt-3 rounded-full font-semibold">
              <Link to="/products" onClick={() => setMobileOpen(false)}>{t("nav.shopNow")}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
