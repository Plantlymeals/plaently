import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Testimonial = Tables<"testimonials">;

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase.from("testimonials").select("*").eq("is_published", true).order("sort_order").then(({ data }) => {
      if (data) setTestimonials(data);
    });
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 md:py-28 gradient-subtle">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">Vad andra säger</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-2xl bg-card border border-border/50 p-8 shadow-card space-y-4 animate-fade-up">
              <p className="text-foreground/80 leading-relaxed italic">"{t.quote}"</p>
              <div>
                <p className="font-heading font-semibold text-sm">{t.author_name}</p>
                <p className="text-xs text-muted-foreground">{t.author_role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
