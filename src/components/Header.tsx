import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Hem", path: "/" },
  { label: "Produkter", path: "/products" },
  { label: "Så funkar det", path: "/#how-it-works" },
  { label: "Näring", path: "/nutrition" },
  { label: "Livsstil", path: "/lifestyle" },
  { label: "Om oss", path: "/about" },
  { label: "Blogg", path: "/blog" },
  { label: "FAQ", path: "/faq" },
  { label: "Kontakt", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="PLÄNTLY" className="h-7 md:h-8" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:text-primary hover:bg-primary/5 ${
                location.pathname === item.path ? "text-primary bg-primary/5" : "text-foreground/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CartDrawer />
          <Button asChild className="hidden sm:inline-flex rounded-full px-6 font-semibold">
            <Link to="/products">Handla nu</Link>
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
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary ${
                  location.pathname === item.path ? "text-primary bg-primary/5" : "text-foreground/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-3 rounded-full font-semibold">
              <Link to="/products" onClick={() => setMobileOpen(false)}>Handla nu</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
