import { Dumbbell, Leaf, CandyOff, Clock, Sprout, Scale } from "lucide-react";

const features = [
  { icon: Dumbbell, title: "Högprotein", desc: "20g växtprotein per portion" },
  { icon: Leaf, title: "Växtbaserat", desc: "100% veganskt, riktiga råvaror" },
  { icon: CandyOff, title: "Lågt socker", desc: "Inga tillsatta sockerarter eller sötningsmedel" },
  { icon: Clock, title: "Klart på minuter", desc: "Tillsätt bara hett vatten och njut" },
  { icon: Sprout, title: "Hållbart", desc: "Miljövänliga ingredienser & förpackningar" },
  { icon: Scale, title: "Balanserad näring", desc: "Optimerade makron för varje måltid" },
];

const WhySection = () => {
  return (
    <section className="py-20 md:py-28 gradient-subtle">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">Varför PLÄNTLY?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Allt du behöver i en måltid. Inget du inte behöver.
          </p>
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
