import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container max-w-3xl space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">About PLÄNTLY</h1>
            <p className="text-muted-foreground text-lg">Making healthy, plant-based protein meals simple, delicious, and sustainable for modern life.</p>
          </div>

          <div className="space-y-8 text-muted-foreground leading-relaxed animate-fade-up">
            <p>PLÄNTLY was born in Scandinavia from a simple frustration: why is it so hard to eat well when you're busy? Convenience food is usually junk, and healthy food takes time most people don't have.</p>
            <p>We set out to create something different — real meals, with real protein, from real plants. No powders, no shakes, no compromises. Just food that's as good for you as it tastes, ready in the time it takes to boil a kettle.</p>
            <p>Our team of chefs and nutritionists spent over a year developing recipes that deliver 20–25g of plant protein per serving, with balanced macros, honest ingredients, and flavours people actually crave.</p>
            <p>Today, PLÄNTLY is trusted by athletes, offices, entrepreneurs, and anyone who refuses to choose between health and convenience. We're on a mission to make plant-based protein the easiest choice for modern life.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 animate-fade-up">
            {[
              { stat: "2024", label: "Founded in Stockholm" },
              { stat: "50K+", label: "Meals served" },
              { stat: "100%", label: "Plant-based" },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center rounded-2xl bg-secondary p-6">
                <p className="text-3xl font-bold text-primary">{stat}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
