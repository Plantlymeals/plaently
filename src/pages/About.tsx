import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useTranslation } from "@/lib/i18n";

const About = () => {
  const { t, lang } = useTranslation();

  return (
    <Layout>
      <SEOHead title={t("seo.about.title")} description={t("seo.about.description")} path="/about" locale={lang} />
      <section className="py-12 md:py-20">
        <div className="container max-w-3xl space-y-12">
          <Breadcrumbs items={[{ label: lang === "sv" ? "Om oss" : "About", path: "/about" }]} lang={lang} className="mb-0" />
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{t("about.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("about.subtitle")}</p>
          </div>
          <div className="space-y-8 text-muted-foreground leading-relaxed animate-fade-up">
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
            <p>{t("about.p3")}</p>
            <p>{t("about.p4")}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 animate-fade-up">
            {[
              { stat: "2025", label: t("about.founded") },
              { stat: "1000+", label: t("about.mealsServed") },
              { stat: "100%", label: t("about.plantBasedStat") },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center rounded-2xl bg-secondary p-6">
                <p className="text-3xl font-bold text-primary">{stat}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
