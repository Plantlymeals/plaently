import { Dumbbell, Leaf, CandyOff, Clock, Sprout, Scale } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const WhySection = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Dumbbell, title: t("why.highProtein"), desc: t("why.highProteinDesc") },
    { icon: Leaf, title: t("why.plantBased"), desc: t("why.plantBasedDesc") },
    { icon: CandyOff, title: t("why.lowSugar"), desc: t("why.lowSugarDesc") },
    { icon: Clock, title: t("why.readyInMinutes"), desc: t("why.readyInMinutesDesc") },
    { icon: Sprout, title: t("why.sustainable"), desc: t("why.sustainableDesc") },
    { icon: Scale, title: t("why.balanced"), desc: t("why.balancedDesc") },
  ];

  return (
    <section className="py-20 md:py-28 gradient-subtle">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">{t("why.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("why.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 animate-fade-up">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
