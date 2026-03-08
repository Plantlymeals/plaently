import { Briefcase, Dumbbell, Plane, Utensils } from "lucide-react";

const useCases = [
  { icon: Briefcase, title: "Kontorsluncher", desc: "Näringsrika måltider vid skrivbordet utan dåligt samvete." },
  { icon: Dumbbell, title: "Efter träningen", desc: "Fyll på med 20g växtprotein efter varje pass." },
  { icon: Plane, title: "Resedagar", desc: "Lätta, behöver ingen kyl — perfekta måltider för dig som är på språng." },
  { icon: Utensils, title: "Snabb hälsosam middag", desc: "En riktig middag på 5 minuter, även dina mest hektiska kvällar." },
];

const LifestyleSection = () => {
  return (
    <section className="py-20 md:py-28 gradient-subtle">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">Byggd för det moderna livet</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Vart din dag än tar dig — PLÄNTLY passar in.
          </p>
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
