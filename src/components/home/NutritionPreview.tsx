import { useTranslation } from "@/lib/i18n";

const NutritionPreview = () => {
  const { t } = useTranslation();

  const macros = [
    { label: t("nutrition.protein"), value: "20g", percent: 75, color: "bg-primary" },
    { label: t("nutrition.carbs"), value: "40g", percent: 55, color: "bg-primary/60" },
    { label: t("nutrition.fat"), value: "12g", percent: 35, color: "bg-primary/30" },
    { label: t("nutrition.calories"), value: "370 kcal", percent: 45, color: "bg-primary/50" },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 animate-fade-up">
            <h2 className="font-heading text-3xl md:text-5xl font-bold">{t("nutrition.title")}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{t("nutrition.desc")}</p>
            <p className="text-muted-foreground text-sm">{t("nutrition.average")}</p>
          </div>
          <div className="space-y-6 animate-fade-up-delay-1">
            {macros.map(({ label, value, percent, color }) => (
              <div key={label} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{label}</span>
                  <span className="text-primary">{value}</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NutritionPreview;
