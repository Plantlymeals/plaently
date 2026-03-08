import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <img src={logo} alt="PLÄNTLY" className="h-7 brightness-0 invert" />
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Växtbaserade proteinmåltider för det moderna livet. Skandinavisk enkelhet möter riktig näring.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">Utforska</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Produkter", path: "/products" },
                { label: "Näring", path: "/nutrition" },
                { label: "Livsstil", path: "/lifestyle" },
                { label: "Om oss", path: "/about" },
                { label: "Blogg", path: "/blog" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">Support</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: "FAQ", path: "/faq" },
                { label: "Kontakt", path: "/contact" },
                { label: "Frakt", path: "/shipping" },
                { label: "Integritetspolicy", path: "/privacy-policy" },
                { label: "Villkor", path: "/terms-of-service" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-primary-foreground/40">Håll dig uppdaterad</h4>
            <p className="text-sm text-primary-foreground/60">Få näringstips och exklusiva erbjudanden.</p>
            <div className="flex gap-2">
              <Input placeholder="Din e-post" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/30 rounded-full" />
              <Button className="rounded-full px-5 shrink-0">Gå med</Button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">© 2026 PLÄNTLY. Alla rättigheter förbehållna.</p>
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
