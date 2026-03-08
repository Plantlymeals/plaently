import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type FAQ = Tables<"faqs">;

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    supabase.from("faqs").select("*").eq("is_published", true).order("sort_order").then(({ data }) => {
      if (data) setFaqs(data);
    });
  }, []);

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-3xl space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">FAQ</h1>
            <p className="text-muted-foreground text-lg">Common questions about PLÄNTLY meals.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-3 animate-fade-up">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="rounded-xl border border-border/50 px-6 shadow-card">
                <AccordionTrigger className="font-heading font-medium text-sm hover:text-primary transition-colors">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage;
