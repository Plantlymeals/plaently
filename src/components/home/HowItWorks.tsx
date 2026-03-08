const steps = [
  { number: "01", title: "Välj dina måltider", desc: "Välj bland våra kocklagade, proteinrika smaker." },
  { number: "02", title: "Tillsätt hett vatten", desc: "Häll i kokande vatten, rör om och vänta 5 minuter." },
  { number: "03", title: "Njut av riktigt protein", desc: "En komplett, balanserad måltid med 20g växtprotein." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">Så funkar det</h2>
          <p className="text-muted-foreground text-lg">Tre enkla steg till riktig näring.</p>
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
