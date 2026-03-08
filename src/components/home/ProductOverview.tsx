import { Link } from "react-router-dom";
import { Clock, Flame, Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const ProductOverview = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase.from("products").select("*").eq("is_published", true).order("sort_order").limit(4).then(({ data }) => {
      if (data) setProducts(data);
    });
  }, []);

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
              className={`group rounded-2xl bg-card border border-border/50 p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-up`}
            >
              <div className="h-40 rounded-xl bg-secondary mb-5 flex items-center justify-center">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <span className="text-4xl">🍝</span>
                )}
              </div>
              <h3 className="font-heading font-semibold text-sm leading-tight mb-4 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Dumbbell className="h-3 w-3" />{product.protein}</span>
                <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{product.calories}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{product.prep_time}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductOverview;
