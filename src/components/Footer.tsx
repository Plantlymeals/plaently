import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-heading text-2xl font-bold text-primary">PLÄNTLY</h3>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              High protein vegan ready meals for modern life. Plant-based protein meals with Scandinavian simplicity.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">Explore</h4>
            <nav className="flex flex-col gap-2">
              {["Products", "Nutrition", "Lifestyle", "About", "Blog"].map((item) => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">Support</h4>
            <nav className="flex flex-col gap-2">
              {["FAQ", "Contact", "Shipping", "Privacy Policy", "Terms of Service"].map((item) => (
                <Link key={item} to={`/${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">Stay Updated</h4>
            <p className="text-sm text-primary-foreground/60">Get nutrition tips and exclusive offers.</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 rounded-full" />
              <Button className="rounded-full px-5 shrink-0">Join</Button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">© 2026 PLÄNTLY. All rights reserved.</p>
          <div className="flex gap-6">
            {["Instagram", "TikTok", "LinkedIn"].map((social) => (
              <a key={social} href="#" className="text-xs text-primary-foreground/40 hover:text-primary transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
