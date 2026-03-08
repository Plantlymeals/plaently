import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="py-20 md:py-28 gradient-primary">
      <div className="container text-center space-y-8 animate-fade-up">
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground">
          Eat Smarter. Live Better.
        </h2>
        <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
          Join thousands who've made the switch to real, plant-based protein meals.
        </p>
        <Button asChild size="lg" className="rounded-full px-10 text-base font-semibold bg-foreground text-background hover:bg-foreground/90">
          <Link to="/products">Shop PLÄNTLY</Link>
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
