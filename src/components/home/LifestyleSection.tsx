import { Briefcase, Dumbbell, Plane, Utensils } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const LifestyleSection = () => {
  const { t } = useTranslation();

  const useCases = [
    { icon: Briefcase, title: t("lifestyle.office"), desc: t("lifestyle.officeDesc") },
    { icon: Dumbbell, title: t("lifestyle.postWorkout"), desc: t("lifestyle.postWorkoutDesc") },
    { icon: Plane, title: t("lifestyle.travel"), desc: t("lifestyle.travelDesc") },
    { icon: Utensils, title: t("lifestyle.dinner"), desc: t("lifestyle.dinnerDesc") },
  ];

  return (
    <section className="py-20 md:py-28 gradient-subtle">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">{t("lifestyle.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("lifestyle.subtitle")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-card border border-border/50 p-6 shadow-card text-center space-y-3 animate-fade-up hover:shadow-elevated transition-all duration-300">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
