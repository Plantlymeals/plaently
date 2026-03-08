import { Dumbbell, Leaf, CandyOff, Clock, Sprout, Scale } from "lucide-react";

const features = [
  { icon: Dumbbell, title: "High Protein", desc: "20–25g of plant protein per serving" },
  { icon: Leaf, title: "Plant‑Based", desc: "100% vegan, real ingredients" },
  { icon: CandyOff, title: "Low Sugar", desc: "No added sugars or sweeteners" },
  { icon: Clock, title: "Ready in Minutes", desc: "Just add hot water and enjoy" },
  { icon: Sprout, title: "Sustainable", desc: "Eco-friendly ingredients & packaging" },
  { icon: Scale, title: "Balanced Nutrition", desc: "Optimized macros for every meal" },
];

const WhySection = () => {
  return (
    <section className="py-20 md:py-28 gradient-subtle">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">Why PLÄNTLY?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need in a meal. Nothing you don't.
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
