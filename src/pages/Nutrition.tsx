import Layout from "@/components/Layout";

const Nutrition = () => {
  const macros = [
    { label: "Protein", value: "20g", desc: "Komplett aminosyraprofil från ärt-, soja- och risprotein." },
    { label: "Kolhydrater", value: "36–44g", desc: "Långsam energifrisättning från fullkorn och grönsaker." },
    { label: "Fett", value: "10–14g", desc: "Hälsosamma fetter från olivolja, kokos och nötter." },
    { label: "Fiber", value: "4–7g", desc: "Tarmvänlig fiber för mättnad och matsmältning." },
  ];

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-4xl space-y-16">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Växtbaserad proteinnäring</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Varje PLÄNTLY-måltid är formulerad av nutritionister för att leverera komplett, balanserad näring från 100% veganska källor.
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
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Varför växtprotein?</h2>
            <div className="prose prose-lg text-muted-foreground space-y-4">
              <p>Växtbaserade proteiner erbjuder en komplett aminosyraprofil när de kombineras rätt, samtidigt som de är lättare att smälta och betydligt mer hållbara än animaliska källor.</p>
              <p>PLÄNTLY använder en egen blandning av ärt-, soja- och risprotein för att uppnå ett komplett aminosyravärde som matchar vassleprotein i biotillgänglighet.</p>
              <p>Utöver protein är våra måltider rika på mikronäringsämnen, antioxidanter och fiber — näringsämnen som ofta saknas i processad snabbmat.</p>
            </div>
          </div>

          <div className="space-y-6 animate-fade-up">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Hållbarhetseffekt</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { stat: "80%", label: "Mindre CO₂-utsläpp jämfört med köttmåltider" },
                { stat: "75%", label: "Mindre vattenanvändning per portion" },
                { stat: "90%", label: "Mindre markanvändning jämfört med animaliskt protein" },
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
