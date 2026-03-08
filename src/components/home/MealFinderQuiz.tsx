import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Sparkles, ShoppingCart, Loader2 } from "lucide-react";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string; emoji: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "lifestyle",
    question: "Hur skulle du beskriva din livsstil?",
    options: [
      { label: "Lugn & balanserad", value: "relaxed", emoji: "🧘" },
      { label: "Aktiv & på språng", value: "active", emoji: "🏃" },
      { label: "Upptagen yrkesperson", value: "professional", emoji: "💼" },
      { label: "Team / kontorskultur", value: "team", emoji: "🏢" },
    ],
  },
  {
    id: "meals_per_week",
    question: "Hur många växtbaserade måltider vill du ha per vecka?",
    options: [
      { label: "Några (2–3)", value: "few", emoji: "🌱" },
      { label: "Dagligen (5–7)", value: "daily", emoji: "🥗" },
      { label: "Flera per dag", value: "multiple", emoji: "🍽️" },
      { label: "För hela gänget", value: "crew", emoji: "👥" },
    ],
  },
  {
    id: "goal",
    question: "Vad är ditt främsta näringsmål?",
    options: [
      { label: "Testa något nytt", value: "explore", emoji: "✨" },
      { label: "Driva min träning", value: "performance", emoji: "💪" },
      { label: "Äta hälsosammare på jobbet", value: "work", emoji: "🥦" },
      { label: "Mätta en grupp prisvärt", value: "group", emoji: "🤝" },
    ],
  },
];

type BundleKey = "starter" | "athlete" | "office" | "big-office";

interface BundleInfo {
  name: string;
  count: number;
  searchTitle: string;
  explanation: string;
  image: string;
}

const BUNDLES: Record<BundleKey, BundleInfo> = {
  starter: {
    name: "Starter Pack",
    count: 12,
    searchTitle: "Starter",
    explanation: "Perfekt för att prova PLÄNTLY — 12 måltider för att utforska alla våra smaker i din egen takt.",
    image: "/images/products/starter-pack.png",
  },
  athlete: {
    name: "Athlete Pack",
    count: 24,
    searchTitle: "Athlete",
    explanation: "Designad för aktiva livsstilar — 24 proteinrika måltider som håller dig laddad genom varje pass.",
    image: "/images/products/athlete-pack.png",
  },
  office: {
    name: "Office Pack",
    count: 60,
    searchTitle: "Office",
    explanation: "Hälsosamma luncher fixade — 60 måltider för den upptagna yrkespersonen som vill ha näring utan krångel.",
    image: "/images/products/office-pack.png",
  },
  "big-office": {
    name: "Big Office Pack",
    count: 120,
    searchTitle: "Big Office",
    explanation: "Mätta hela teamet — 120 måltider till bästa pris per portion. Perfekt för kontor och grupper.",
    image: "/images/products/big-office-pack.png",
  },
};

function getRecommendation(answers: Record<string, string>): BundleKey {
  const { lifestyle, meals_per_week, goal } = answers;
  if (lifestyle === "team" || goal === "group" || meals_per_week === "crew") return "big-office";
  if (lifestyle === "professional" || goal === "work" || meals_per_week === "multiple") return "office";
  if (lifestyle === "active" || goal === "performance" || meals_per_week === "daily") return "athlete";
  return "starter";
}

const MealFinderQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<BundleKey | null>(null);
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const currentQuestion = step >= 1 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null;

  const handleSelect = (value: string) => setSelectedOption(value);

  const handleNext = async () => {
    if (currentQuestion && selectedOption) {
      const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (step === QUESTIONS.length) {
        const rec = getRecommendation(newAnswers);
        setResult(rec);
        setStep(step + 1);
        setLoadingProduct(true);
        try {
          const products = await fetchShopifyProducts(10, "product_type:Bundle");
          if (products) {
            const match = products.find((p) =>
              p.node.title.toLowerCase().includes(BUNDLES[rec].searchTitle.toLowerCase())
            );
            if (match) setShopifyProduct(match);
          }
        } catch (e) {
          console.error("Failed to load bundle:", e);
        } finally {
          setLoadingProduct(false);
        }
      } else {
        setStep(step + 1);
      }
    } else if (step === 0) {
      setStep(1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setSelectedOption(null);
      setStep(step - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!shopifyProduct) return;
    const variant = shopifyProduct.node.variants.edges[0]?.node;
    if (!variant) return;
    await addItem({
      product: shopifyProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Tillagd i varukorgen!", { position: "top-center" });
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setSelectedOption(null);
    setResult(null);
    setShopifyProduct(null);
  };

  const bundle = result ? BUNDLES[result] : null;
  const isResultStep = step === QUESTIONS.length + 1;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--primary))_0%,hsl(var(--secondary))_100%)] opacity-10" />
      <div className="container relative z-10 max-w-2xl mx-auto">
        <div className="text-center space-y-3 mb-10 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Hitta ditt perfekta paket</h2>
          <p className="text-muted-foreground text-lg">Svara på 3 snabba frågor — vi matchar dig med rätt paket.</p>
        </div>

        <Card className="p-8 md:p-10 border-border/50 shadow-[var(--shadow-elevated)] bg-card/80 backdrop-blur-sm animate-fade-up">
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-semibold">Måltidsquiz</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">Osäker på vilket paket som passar dig? Vi hjälper dig — det tar bara 30 sekunder.</p>
              </div>
              <Button onClick={handleNext} size="lg" className="rounded-full font-semibold px-8">
                Starta quiz <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {currentQuestion && !isResultStep && (
            <div className="space-y-6">
              <div className="flex gap-2">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < step ? "bg-primary" : i === step - 1 ? "bg-primary" : "bg-border"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Fråga {step} av {QUESTIONS.length}</p>
              <h3 className="font-heading text-xl font-semibold">{currentQuestion.question}</h3>
              <div className="grid gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                      selectedOption === opt.value
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="font-medium text-foreground">{opt.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={handleBack} className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Tillbaka
                </Button>
                <Button onClick={handleNext} disabled={!selectedOption} className="rounded-full font-semibold px-6">
                  {step === QUESTIONS.length ? "Se resultat" : "Nästa"} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {isResultStep && bundle && (
            <div className="space-y-6 text-center animate-fade-up">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Din match</p>
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-muted">
                <img src={shopifyProduct?.node.images?.edges?.[0]?.node.url || bundle.image} alt={bundle.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold">{bundle.name}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{bundle.explanation}</p>
              {shopifyProduct && (
                <p className="text-2xl font-bold text-primary">
                  {shopifyProduct.node.priceRange.minVariantPrice.currencyCode}{" "}
                  {parseFloat(shopifyProduct.node.priceRange.minVariantPrice.amount).toFixed(0)}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                {loadingProduct ? (
                  <Button disabled size="lg" className="rounded-full font-semibold px-8">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Laddar…
                  </Button>
                ) : shopifyProduct ? (
                  <Button onClick={handleAddToCart} disabled={isLoading} size="lg" className="rounded-full font-semibold px-8">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingCart className="w-4 h-4 mr-2" /> Lägg i varukorg</>}
                  </Button>
                ) : null}
                <Button variant="outline" onClick={handleRestart} size="lg" className="rounded-full font-semibold px-8">
                  Gör om quiz
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default MealFinderQuiz;
