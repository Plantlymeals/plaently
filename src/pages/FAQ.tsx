import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/lib/i18n";

interface FAQRow {
  id: string;
  question: string;
  answer: string;
  question_sv: string | null;
  answer_sv: string | null;
  is_published?: boolean | null;
  sort_order: number | null;
}

const FAQPage = () => {
  // Loader data is rendered server-side (and powers the FAQPage JSON-LD in the
  // route head); the client refetch keeps CMS edits fresh after hydration.
  const initialFaqs = useLoaderData({ from: "/faq", structuralSharing: false }) as FAQRow[] | undefined;
  const [faqs, setFaqs] = useState<FAQRow[]>(initialFaqs ?? []);
  const { lang, t } = useTranslation();

  useEffect(() => {
    supabase.from("faqs").select("*").eq("is_published", true).order("sort_order").then(({ data }) => {
      if (data) setFaqs(data as unknown as FAQRow[]);
    });
  }, []);

  return (
    <Layout>
      <SEOHead title={t("seo.faq.title")} description={t("seo.faq.description")} path="/faq" locale={lang} />
      <section className="py-12 md:py-20">
        <div className="container max-w-3xl space-y-12">
          <Breadcrumbs items={[{ label: lang === "sv" ? "Vanliga frågor" : "FAQ", path: "/faq" }]} lang={lang} className="mb-0" />
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{t("faq.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("faq.subtitle")}</p>
          </div>
          {/* Heading level between the H1 and the accordion's H3 triggers. */}
          <h2 className="sr-only">{lang === "sv" ? "Vanliga frågor och svar" : "Frequently asked questions"}</h2>
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
