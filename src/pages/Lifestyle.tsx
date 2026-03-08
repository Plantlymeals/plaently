import Layout from "@/components/Layout";
import { Briefcase, Dumbbell, Rocket, Utensils } from "lucide-react";

const personas = [
  {
    icon: Dumbbell,
    title: "Athletes & Fitness",
    desc: "Fuel your training with 20–25g of plant protein per meal. PLÄNTLY meals are designed for fast recovery and sustained energy, whether you're lifting, running or training for your next competition.",
  },
  {
    icon: Briefcase,
    title: "Office & Corporate",
    desc: "Upgrade your workplace meals. PLÄNTLY office packs keep teams fueled with nutritious, hot meals — no kitchen, no chef, no hassle. Just boiling water and 5 minutes.",
  },
  {
    icon: Rocket,
    title: "Entrepreneurs & Freelancers",
    desc: "When you're building something, you don't have time for bad food. PLÄNTLY keeps you sharp with balanced nutrition that takes less time than ordering a coffee.",
  },
  {
    icon: Utensils,
    title: "Everyday Healthy Eating",
    desc: "Not everyone has time to cook three meals a day. PLÄNTLY makes it easy to eat well, even on your busiest days. Real food, real protein, zero compromise.",
  },
];

const Lifestyle = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container space-y-16">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Built for Every Lifestyle</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              PLÄNTLY fits into your life, not the other way around.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {personas.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-card border border-border/50 p-8 shadow-card space-y-4 animate-fade-up hover:shadow-elevated transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-heading text-xl font-semibold">{title}</h2>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Lifestyle;
