import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const bundles = [
  { name: "Starter Pack", meals: 12, price: "€39", badge: null },
  { name: "Athlete Pack", meals: 24, price: "€69", badge: "Most Popular" },
  { name: "Office Pack", meals: 60, price: "€149", badge: "Best Value" },
  { name: "Big Office Pack", meals: 120, price: "€269", badge: null },
];

const BundleSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">Pick Your Pack</h2>
          <p className="text-muted-foreground text-lg">Save more when you buy more.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bundles.map(({ name, meals, price, badge }) => (
            <div key={name} className="relative rounded-2xl bg-card border border-border/50 p-6 shadow-card text-center space-y-4 hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 animate-fade-up">
              {badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold">
                  {badge}
                </Badge>
              )}
              <h3 className="font-heading text-lg font-semibold pt-2">{name}</h3>
              <p className="text-3xl font-bold text-primary">{price}</p>
              <p className="text-sm text-muted-foreground">{meals} meals</p>
              <Button asChild className="w-full rounded-full font-semibold">
                <Link to="/products">Order Now</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BundleSection;
