import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";

interface FAQRow {
  id: string;
  question: string;
  answer: string;
  question_sv: string | null;
  answer_sv: string | null;
  is_published: boolean | null;
  sort_order: number | null;
}

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQRow[]>([]);
  const { lang, t } = useTranslation();

  useEffect(() => {
    supabase.from("faqs").select("*").eq("is_published", true).order("sort_order").then(({ data }) => {
      if (data) setFaqs(data as unknown as FAQRow[]);
    });
  }, []);

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-3xl space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{t("faq.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("faq.subtitle")}</p>
          </div>
          <Accordion type="single" collapsible className="space-y-3 animate-fade-up">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="rounded-xl border border-border/50 px-6 shadow-card">
                <AccordionTrigger className="font-heading font-medium text-sm hover:text-primary transition-colors">
                  {lang === "sv" && faq.question_sv ? faq.question_sv : faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {lang === "sv" && faq.answer_sv ? faq.answer_sv : faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage;
