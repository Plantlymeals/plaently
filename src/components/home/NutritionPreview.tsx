const NutritionPreview = () => {
  const macros = [
    { label: "Protein", value: "22g", percent: 75, color: "bg-primary" },
    { label: "Carbs", value: "40g", percent: 55, color: "bg-primary/60" },
    { label: "Fat", value: "12g", percent: 35, color: "bg-primary/30" },
    { label: "Calories", value: "370 kcal", percent: 45, color: "bg-primary/50" },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 animate-fade-up">
            <h2 className="font-heading text-3xl md:text-5xl font-bold">Science-Backed Nutrition</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Every PLÄNTLY meal is designed by nutritionists to deliver optimal macronutrients from
              100% plant-based sources. High in complete protein, balanced carbs and healthy fats.
            </p>
            <p className="text-muted-foreground text-sm">
              Average values per serving. Varies by flavour.
            </p>
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
