import Layout from "@/components/Layout";

const Nutrition = () => {
  const macros = [
    { label: "Protein", value: "20–25g", desc: "Complete amino acid profile from pea, soy and rice protein." },
    { label: "Carbohydrates", value: "36–44g", desc: "Slow-release energy from whole grains and vegetables." },
    { label: "Fat", value: "10–14g", desc: "Healthy fats from olive oil, coconut and nuts." },
    { label: "Fiber", value: "4–7g", desc: "Gut-friendly fiber for satiety and digestive health." },
  ];

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-4xl space-y-16">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Plant-Based Protein Nutrition</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every PLÄNTLY plant-based protein meal is formulated by nutritionists to deliver complete, balanced nutrition from 100% vegan sources.
            </p>
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
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Why Plant Protein?</h2>
            <div className="prose prose-lg text-muted-foreground space-y-4">
              <p>Plant-based proteins offer a complete amino acid profile when properly combined, while being easier to digest and significantly more sustainable than animal sources.</p>
              <p>PLÄNTLY uses a proprietary blend of pea, soy and rice protein to achieve a complete amino acid score, rivaling whey protein in bioavailability.</p>
              <p>Beyond protein, our meals are rich in micronutrients, antioxidants and fiber — nutrients often missing from processed convenience foods.</p>
            </div>
          </div>

          <div className="space-y-6 animate-fade-up">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Sustainability Impact</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { stat: "80%", label: "Less CO₂ emissions vs. meat-based meals" },
                { stat: "75%", label: "Less water usage per serving" },
                { stat: "90%", label: "Less land use compared to animal protein" },
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
