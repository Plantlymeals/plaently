import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How much protein is in each meal?", a: "Every PLÄNTLY meal contains 20–25g of complete plant-based protein from pea, soy and rice protein." },
  { q: "Is PLÄNTLY 100% vegan?", a: "Yes. All PLÄNTLY meals are 100% plant-based and suitable for vegans. Some contain wheat, soy or nuts — check individual product pages for allergen details." },
  { q: "How do I prepare a PLÄNTLY meal?", a: "Simply open the cup, add the seasoning sachet, pour boiling water to the fill line, stir, close the lid and wait 5 minutes. Stir again and enjoy!" },
  { q: "Where do you ship?", a: "We currently ship across the EU and UK. Check our shipping page for delivery times and costs to your country." },
  { q: "Can I subscribe and save?", a: "Yes! Subscribe to any meal or bundle and save 15% on every order. You can pause, skip or cancel anytime." },
  { q: "Are the cups recyclable?", a: "Yes. Our cups are made from recyclable materials. Check your local recycling guidelines for proper disposal." },
  { q: "What's the shelf life?", a: "PLÄNTLY meals have a shelf life of 12 months from production. No refrigeration needed until opened." },
  { q: "Are there any artificial ingredients?", a: "No. We use only real, recognizable ingredients. No artificial colours, flavours, sweeteners or preservatives." },
];

const FAQ = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-3xl space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">FAQ</h1>
            <p className="text-muted-foreground text-lg">Common questions about PLÄNTLY meals.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-3 animate-fade-up">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border/50 px-6 shadow-card">
                <AccordionTrigger className="font-heading font-medium text-sm hover:text-primary transition-colors">{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
