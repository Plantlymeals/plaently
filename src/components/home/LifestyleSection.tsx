import { Briefcase, Dumbbell, Plane, Utensils } from "lucide-react";

const useCases = [
  { icon: Briefcase, title: "Office Lunches", desc: "Nutritious meals at your desk without the takeout guilt." },
  { icon: Dumbbell, title: "Post‑Workout Recovery", desc: "Refuel with 20–25g plant protein after every session." },
  { icon: Plane, title: "Travel Days", desc: "Lightweight, no-fridge-needed meals for life on the go." },
  { icon: Utensils, title: "Quick Healthy Dinners", desc: "A real dinner in 5 minutes on your busiest evenings." },
];

const LifestyleSection = () => {
  return (
    <section className="py-20 md:py-28 gradient-subtle">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">Built for Modern Life</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Wherever your day takes you, PLÄNTLY fits in.
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
