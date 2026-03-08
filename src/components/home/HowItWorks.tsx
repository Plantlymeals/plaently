const steps = [
  { number: "01", title: "Choose Your Meals", desc: "Pick from our range of chef-crafted, high-protein flavours." },
  { number: "02", title: "Add Hot Water", desc: "Pour boiling water, stir and wait 5 minutes." },
  { number: "03", title: "Enjoy Real Protein", desc: "A complete, balanced meal with 20–25g plant protein." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">How It Works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to real nutrition.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map(({ number, title, desc }) => (
            <div key={number} className="text-center space-y-4 animate-fade-up">
              <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center">
                <span className="font-heading text-xl font-bold text-primary-foreground">{number}</span>
              </div>
              <h3 className="font-heading text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
