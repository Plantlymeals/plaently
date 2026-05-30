import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "@/lib/i18n";

const Nutrition = () => {
  const { t } = useTranslation();

  const macros = [
    { label: t("nutrition.protein"), value: "20–21g", desc: t("nutritionPage.proteinDesc") },
    { label: t("nutritionPage.carbsLabel"), value: t("nutritionPage.carbsValue"), desc: t("nutritionPage.carbsDesc") },
    { label: t("nutrition.fat"), value: "2–7g", desc: t("nutritionPage.fatDesc") },
    { label: t("nutritionPage.fiberLabel"), value: t("nutritionPage.fiberValue"), desc: t("nutritionPage.fiberDesc") },
    { label: t("nutrition.calories"), value: "228–285 kcal", desc: t("nutritionPage.caloriesDesc") },
  ];

  return (
    <Layout>
      <SEOHead title="Näring — PLÄNTLY | Högprotein plantbaserad näring" description="Se näringsinnehållet i PLÄNTLY:s måltider — 20g+ protein, balanserade makros och naturliga ingredienser." path="/nutrition" />
      <section className="py-12 md:py-20">
        <div className="container max-w-4xl space-y-16">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{t("nutritionPage.title")}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("nutritionPage.subtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {macros.map(({ label, value, desc }) => (
              <div key={label} className="rounded-2xl bg-card border border-border/50 p-8 shadow-card space-y-3 animate-fade-up">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
                <p className="text-3xl font-bold text-primary">{value}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
          <div className="space-y-6 animate-fade-up">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">{t("nutritionPage.whyTitle")}</h2>
            <div className="prose prose-lg text-muted-foreground space-y-4">
              <p>{t("nutritionPage.whyP1")}</p>
              <p>{t("nutritionPage.whyP2")}</p>
              <p>{t("nutritionPage.whyP3")}</p>
            </div>
          </div>
          <div className="space-y-6 animate-fade-up">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">{t("nutritionPage.sustainTitle")}</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { stat: "80%", label: t("nutritionPage.co2") },
                { stat: "75%", label: t("nutritionPage.water") },
                { stat: "90%", label: t("nutritionPage.land") },
              ].map(({ stat, label }) => (
                <div key={label} className="text-center rounded-2xl bg-secondary p-6 space-y-2">
                  <p className="text-3xl font-bold text-primary">{stat}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Nutrition;
