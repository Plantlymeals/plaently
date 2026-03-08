const testimonials = [
  { quote: "PLÄNTLY has completely replaced my sad desk lunches. Real food, real protein, zero effort.", author: "Anna K.", role: "Marketing Director" },
  { quote: "As an athlete, I need quick protein after training. These meals are a game-changer.", author: "Erik L.", role: "CrossFit Coach" },
  { quote: "We ordered the Office Pack for our team. Everyone loves it — even the skeptics.", author: "Sofia M.", role: "Startup Founder" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 gradient-subtle">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">What People Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(({ quote, author, role }) => (
            <div key={author} className="rounded-2xl bg-card border border-border/50 p-8 shadow-card space-y-4 animate-fade-up">
              <p className="text-foreground/80 leading-relaxed italic">"{quote}"</p>
              <div>
                <p className="font-heading font-semibold text-sm">{author}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
