import { Briefcase, Dumbbell, Lightbulb, GraduationCap, Users, UtensilsCrossed } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const TrustSection = () => {
  const { t } = useTranslation();

  const icons = [
    { icon: UtensilsCrossed, label: t("trust.realFood") },
    { icon: Briefcase, label: t("trust.offices") },
    { icon: Dumbbell, label: t("trust.athletes") },
    { icon: Lightbulb, label: t("trust.entrepreneurs") },
    { icon: GraduationCap, label: t("trust.students") },
    { icon: Users, label: t("trust.professionals") },
  ];

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container text-center space-y-8">
        <p className="text-lg md:text-xl text-muted-foreground font-medium animate-fade-up-delay-1">{t("trust.loved")}</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 animate-fade-up-delay-2">
          {icons.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
