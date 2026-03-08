import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type HeroContent = Tables<"hero_content">;

const FinalCTA = () => {
  const [cta, setCta] = useState<HeroContent | null>(null);

  useEffect(() => {
    supabase.from("hero_content").select("*").eq("section_key", "final_cta").single().then(({ data }) => {
      if (data) setCta(data);
    });
  }, []);

  return (
    <section className="py-20 md:py-28 gradient-primary">
      <div className="container text-center space-y-8 animate-fade-up">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground">
          {cta?.headline || "Ät smartare. Lev bättre."}
        </h2>
        <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
          {cta?.subheadline || "Gå med tusentals som valt riktiga, växtbaserade proteinmåltider."}
        </p>
        <Button asChild size="lg" className="rounded-full px-10 text-base font-semibold bg-foreground text-background hover:bg-foreground/90">
          <Link to={cta?.cta_link || "/products"}>{cta?.cta_text || "Handla PLÄNTLY"}</Link>
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
