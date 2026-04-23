import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-product.jpg";
import type { Tables } from "@/integrations/supabase/types";
import { useTranslation } from "@/lib/i18n";
import { Leaf, Clock, Dumbbell } from "lucide-react";

type HeroContent = Tables<"hero_content">;

const HeroSection = () => {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    supabase.from("hero_content").select("*").eq("section_key", "homepage_hero").single().then(({ data }) => {
      if (data) setHero(data);
    });
  }, []);

  const headline = t("hero.headline");
  const subheadline = t("hero.subheadline");
  const ctaLink = hero?.cta_link || "/products";

  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container py-20 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-primary-foreground">
              {headline.split("\n").map((line, i) =>
              <span key={i}>{line}{i === 0 && <br />}</span>
              )}
            </h1>
            <p className="text-lg md:text-xl max-w-lg leading-relaxed text-primary-foreground">{subheadline}</p>
            <ul className="flex flex-wrap gap-2 pt-1" aria-label="Key product benefits">
              {[
                { icon: Dumbbell, label: t("hero.badge1") },
                { icon: Clock, label: t("hero.badge2") },
                { icon: Leaf, label: t("hero.badge3") },
              ].map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2 rounded-full bg-background/15 backdrop-blur-sm border border-background/30 px-4 py-1.5 text-sm font-medium text-primary-foreground">
                  <Icon className="h-4 w-4" /> {label}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold bg-background text-foreground hover:bg-background/90">
                <Link to="/products">{t("hero.ctaStarter")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 text-base font-semibold border-background/50 text-background bg-background/15 hover:bg-background/25">
                <Link to={ctaLink} className="text-secondary-foreground">{t("hero.ctaTry")}</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up-delay-2 flex justify-center">
            <img src={hero?.image_url || heroImage} alt="PLÄNTLY plant-based protein meals" className="w-full max-w-xl rounded-2xl shadow-elevated" width={576} height={324} fetchPriority="high" />
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;