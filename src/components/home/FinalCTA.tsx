import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useTranslation } from "@/lib/i18n";

type HeroContent = Tables<"hero_content">;

const FinalCTA = () => {
  const [cta, setCta] = useState<HeroContent | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    supabase.from("hero_content").select("*").eq("section_key", "final_cta").single().then(({ data }) => {
      if (data) setCta(data);
    });
  }, []);

  return (
    <section className="py-20 md:py-28 gradient-primary">
      <div className="container text-center space-y-8 animate-fade-up">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground">
          {cta?.headline || t("cta.headline")}
        </h2>
        <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
          {cta?.subheadline || t("cta.subheadline")}
        </p>
        <Button asChild size="lg" className="rounded-full px-10 text-base font-semibold bg-foreground text-background hover:bg-foreground/90">
          <Link to={cta?.cta_link || "/products"}>{cta?.cta_text || t("cta.button")}</Link>
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
