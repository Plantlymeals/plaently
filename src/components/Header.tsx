import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "How It Works", path: "/#how-it-works" },
  { label: "Nutrition", path: "/nutrition" },
  { label: "Lifestyle", path: "/lifestyle" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-heading text-2xl font-bold tracking-tight text-primary">
          PLÄNTLY
        </Link>

        {/* Desktop nav */}
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
          <Button asChild className="hidden sm:inline-flex rounded-full px-6 font-semibold">
            <Link to="/products">Shop Now</Link>
          </Button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
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
              <Link to="/products" onClick={() => setMobileOpen(false)}>Shop Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
