import { Link } from "react-router-dom";
import { Clock, Flame, Dumbbell } from "lucide-react";

const products = [
  { name: "Plant‑Based Fusilli Bolognese", protein: "22g", calories: "380 kcal", prep: "5 min", slug: "fusilli-bolognese" },
  { name: "Plant‑Based Thai Curry", protein: "20g", calories: "350 kcal", prep: "5 min", slug: "thai-curry" },
  { name: "Plant‑Based Creamy Mushroom", protein: "23g", calories: "360 kcal", prep: "5 min", slug: "creamy-mushroom" },
  { name: "Plant‑Based Mediterranean Pasta", protein: "25g", calories: "390 kcal", prep: "5 min", slug: "mediterranean-pasta" },
];

const ProductOverview = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container space-y-12">
        <div className="text-center space-y-4 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">Our Meals</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Chef-crafted, plant-powered meals packed with protein. Just add hot water.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <Link
              key={product.slug}
              to={`/products/${product.slug}`}
              className={`group rounded-2xl bg-card border border-border/50 p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-up-delay-${Math.min(i, 3)}`}
            >
              <div className="h-40 rounded-xl bg-secondary mb-5 flex items-center justify-center">
                <span className="text-4xl">🍝</span>
              </div>
              <h3 className="font-heading font-semibold text-sm leading-tight mb-4 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Dumbbell className="h-3 w-3" />{product.protein}</span>
                <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{product.calories}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{product.prep}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductOverview;
