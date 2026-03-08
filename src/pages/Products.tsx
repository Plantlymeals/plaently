import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Dumbbell, ArrowLeft } from "lucide-react";

const allProducts = [
  {
    slug: "fusilli-bolognese",
    name: "Plant‑Based Fusilli Bolognese",
    protein: "22g",
    calories: "380 kcal",
    prep: "5 min",
    price: "€3.90",
    description: "Classic Italian comfort, reimagined with 100% plant-based protein. Rich tomato and herb sauce with fusilli pasta.",
    ingredients: "Fusilli pasta (durum wheat), soy protein, tomato paste, onion, garlic, olive oil, basil, oregano, sea salt, black pepper.",
    allergens: "Wheat, Soy",
    nutrition: { protein: "22g", carbs: "42g", fat: "10g", fiber: "6g", sugar: "4g", salt: "1.2g" },
  },
  {
    slug: "thai-curry",
    name: "Plant‑Based Thai Curry",
    protein: "20g",
    calories: "350 kcal",
    prep: "5 min",
    price: "€3.90",
    description: "Aromatic Thai green curry with coconut, vegetables and plant protein. A taste of Southeast Asia in every cup.",
    ingredients: "Rice, pea protein, coconut milk powder, green curry paste, lemongrass, lime leaf, bamboo shoots, bell pepper, coriander.",
    allergens: "None",
    nutrition: { protein: "20g", carbs: "38g", fat: "12g", fiber: "5g", sugar: "3g", salt: "1.0g" },
  },
  {
    slug: "creamy-mushroom",
    name: "Plant‑Based Creamy Mushroom",
    protein: "23g",
    calories: "360 kcal",
    prep: "5 min",
    price: "€3.90",
    description: "Silky creamy mushroom sauce with plant protein and herbs. Comforting, rich, and packed with umami flavour.",
    ingredients: "Penne pasta (durum wheat), soy protein, mushroom powder, cashew cream, garlic, thyme, nutritional yeast, sea salt.",
    allergens: "Wheat, Soy, Nuts (Cashew)",
    nutrition: { protein: "23g", carbs: "36g", fat: "14g", fiber: "4g", sugar: "2g", salt: "1.1g" },
  },
  {
    slug: "mediterranean-pasta",
    name: "Plant‑Based Mediterranean Pasta",
    protein: "25g",
    calories: "390 kcal",
    prep: "5 min",
    price: "€3.90",
    description: "Sun-dried tomatoes, olives, and herbs meet high-protein pasta. The Mediterranean, in a cup.",
    ingredients: "Penne pasta (durum wheat), pea protein, sun-dried tomato, olive pieces, roasted bell pepper, oregano, garlic, olive oil.",
    allergens: "Wheat",
    nutrition: { protein: "25g", carbs: "44g", fat: "11g", fiber: "7g", sugar: "5g", salt: "1.3g" },
  },
];

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = allProducts.find((p) => p.slug === slug);

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">Product not found</h1>
          <Button asChild variant="outline" className="rounded-full"><Link to="/products">Back to Products</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="h-80 md:h-[28rem] rounded-2xl bg-secondary flex items-center justify-center">
              <span className="text-8xl">🍝</span>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <h1 className="font-heading text-3xl md:text-4xl font-bold">{product.name}</h1>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <div className="flex gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Dumbbell className="h-4 w-4 text-primary" />{product.protein} protein</span>
                <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-primary" />{product.calories}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary" />{product.prep}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">{product.price}</span>
                <span className="text-sm text-muted-foreground">per meal</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="rounded-full px-8 font-semibold">Add to Cart</Button>
                <Button variant="outline" className="rounded-full px-8 font-semibold">Subscribe & Save 15%</Button>
              </div>

              {/* Nutrition table */}
              <div className="space-y-3">
                <h3 className="font-heading font-semibold">Nutrition per serving</h3>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(product.nutrition).map(([key, val]) => (
                    <div key={key} className="rounded-xl bg-secondary p-3 text-center">
                      <p className="text-xs text-muted-foreground capitalize">{key}</p>
                      <p className="font-semibold text-sm">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-sm">Ingredients</h3>
                <p className="text-sm text-muted-foreground">{product.ingredients}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-sm">Allergens</h3>
                <p className="text-sm text-muted-foreground">{product.allergens}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-sm">Preparation</h3>
                <p className="text-sm text-muted-foreground">
                  1. Open lid and remove seasoning sachet. 2. Add seasoning. 3. Pour boiling water to fill line. 4. Stir, close lid, wait 5 minutes. 5. Stir again and enjoy!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

// Products grid page
const Products = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Our Meals</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              High-protein, plant-based meals ready in 5 minutes. Pick your favourites.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <Link
                key={product.slug}
                to={`/products/${product.slug}`}
                className="group rounded-2xl bg-card border border-border/50 p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-40 rounded-xl bg-secondary mb-5 flex items-center justify-center">
                  <span className="text-4xl">🍝</span>
                </div>
                <h3 className="font-heading font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-lg font-bold text-primary mb-3">{product.price}</p>
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
    </Layout>
  );
};

export { Products, ProductDetail };
