const NutritionPreview = () => {
  const macros = [
    { label: "Protein", value: "20g", percent: 75, color: "bg-primary" },
    { label: "Kolhydrater", value: "40g", percent: 55, color: "bg-primary/60" },
    { label: "Fett", value: "12g", percent: 35, color: "bg-primary/30" },
    { label: "Kalorier", value: "370 kcal", percent: 45, color: "bg-primary/50" },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 animate-fade-up">
            <h2 className="font-heading text-3xl md:text-5xl font-bold">Vetenskapligt baserad näring</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Varje PLÄNTLY-måltid är designad av nutritionister för att leverera optimala makronäringsämnen från
              100% växtbaserade källor. Högt i komplett protein, balanserade kolhydrater och hälsosamma fetter.
            </p>
            <p className="text-muted-foreground text-sm">
              Genomsnittliga värden per portion. Varierar beroende på smak.
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
