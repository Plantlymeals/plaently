import { useTranslation } from "@/lib/i18n";

const NutritionPreview = () => {
  const { t } = useTranslation();

  // Averages calculated from per-serving data of all 4 meals:
  // Fusilli Bolognese (75g): 263 kcal, 20.3g protein, 37.5g carbs, 2.2g fat, 5.9g fibre
  // Pasta Carbonara (75g): 285 kcal, 20.2g protein, 34.5g carbs, 6.4g fat, 4.3g fibre
  // Smoky BBQ Lentils (65g): 228 kcal, 20.8g protein, 25.4g carbs, 2.9g fat, 9.1g fibre
  // Yellow Curry & Rice (75g): 285 kcal, 20.4g protein, 32.9g carbs, 6.7g fat, 6.1g fibre
  const macros = [
    { label: t("nutrition.protein"), value: "20.4g", percent: 75, color: "bg-primary" },
    { label: t("nutrition.carbs"), value: "32.6g", percent: 55, color: "bg-primary/60" },
    { label: t("nutrition.fat"), value: "4.6g", percent: 20, color: "bg-primary/30" },
    { label: t("nutrition.calories"), value: "265 kcal", percent: 45, color: "bg-primary/50" },
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
