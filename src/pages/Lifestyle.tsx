import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Briefcase, Dumbbell, Rocket, Utensils } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const Lifestyle = () => {
  const { t } = useTranslation();

  const personas = [
    { icon: Dumbbell, title: t("lifestylePage.athleteTitle"), desc: t("lifestylePage.athleteDesc") },
    { icon: Briefcase, title: t("lifestylePage.officeTitle"), desc: t("lifestylePage.officeDesc") },
    { icon: Rocket, title: t("lifestylePage.entrepreneurTitle"), desc: t("lifestylePage.entrepreneurDesc") },
    { icon: Utensils, title: t("lifestylePage.everydayTitle"), desc: t("lifestylePage.everydayDesc") },
  ];

  return (
    <Layout>
      <SEOHead title="Livsstil — PLÄNTLY | Måltider för din livsstil" description="Upptäck hur PLÄNTLY passar din livsstil — för atleter, kontorsarbetare, entreprenörer och alla däremellan." path="/lifestyle" />
      <section className="py-12 md:py-20">
        <div className="container space-y-16">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{t("lifestylePage.title")}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("lifestylePage.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {personas.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-card border border-border/50 p-8 shadow-card space-y-4 animate-fade-up hover:shadow-elevated transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-heading text-xl font-semibold">{title}</h2>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Lifestyle;
