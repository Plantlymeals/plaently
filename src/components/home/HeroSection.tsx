import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-product.png";
import type { Tables } from "@/integrations/supabase/types";

type HeroContent = Tables<"hero_content">;

const HeroSection = () => {
  const [hero, setHero] = useState<HeroContent | null>(null);

  useEffect(() => {
    supabase.from("hero_content").select("*").eq("section_key", "homepage_hero").single().then(({ data }) => {
      if (data) setHero(data);
    });
  }, []);

  const headline = hero?.headline || "Real food.\nReal protein.";
  const subheadline = hero?.subheadline || "Plant‑based meals with 20–25g protein per serving. Ready in minutes.";
  const ctaText = hero?.cta_text || "Shop Meals";
  const ctaLink = hero?.cta_link || "/products";

  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container py-20 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-primary-foreground">
              {headline.split("\n").map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg leading-relaxed">
              {subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold bg-foreground text-background hover:bg-foreground/90">
                <Link to={ctaLink}>{ctaText}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="#how-it-works">Learn How It Works</a>
              </Button>
            </div>
          </div>

          <div className="animate-fade-up-delay-2 flex justify-center">
            <img
              src={hero?.image_url || heroImage}
              alt="PLÄNTLY plant-based protein meal cups on a minimalist podium"
              className="w-full max-w-xl rounded-2xl shadow-elevated"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
