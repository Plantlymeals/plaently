import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowLeft, Sparkles, ShoppingCart, Loader2 } from "lucide-react";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import { useTranslation } from "@/lib/i18n";
import { getBundleSavings } from "@/lib/bundleSavings";
import { useBundleMix } from "@/hooks/useBundleMix";
import { MixBuilderDialog } from "@/components/MixBuilderDialog";
import { useStarterOfferClaim } from "@/hooks/useStarterOffer";
import bolognese from "@/assets/cup-bolognese.webp";
import carbonara from "@/assets/cup-carbonara.webp";
import curry from "@/assets/cup-curry.webp";
import bbq from "@/assets/cup-bbq.webp";

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string }[];
}

const BUNDLES_META: Record<string, { name: string; count: number; searchTitle: string; image: string }> = {
  starter: { name: "Starter Pack", count: 12, searchTitle: "Starter", image: bolognese },
  athlete: { name: "Athlete Pack", count: 24, searchTitle: "Athlete", image: bbq },
  office: { name: "Office Pack", count: 48, searchTitle: "Office", image: curry },
  "big-office": { name: "Big Office Pack", count: 96, searchTitle: "Big Office", image: carbonara },
};

type BundleKey = "starter" | "athlete" | "office" | "big-office";

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
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [offerCode, setOfferCode] = useState<string | null>(null);
  const [offerNotice, setOfferNotice] = useState<string | null>(null);
  const { submit: claimOffer } = useStarterOfferClaim();
  const { t } = useTranslation();
  const { handleAdd, isLoading, dialogProps } = useBundleMix();

  const QUESTIONS: Question[] = [
    {
      id: "lifestyle",
      question: t("quiz.q1"),
      options: [
        { label: t("quiz.q1o1"), value: "relaxed" },
        { label: t("quiz.q1o2"), value: "active" },
        { label: t("quiz.q1o3"), value: "professional" },
        { label: t("quiz.q1o4"), value: "team" },
      ],
    },
    {
      id: "meals_per_week",
      question: t("quiz.q2"),
      options: [
        { label: t("quiz.q2o1"), value: "few" },
        { label: t("quiz.q2o2"), value: "daily" },
        { label: t("quiz.q2o3"), value: "multiple" },
        { label: t("quiz.q2o4"), value: "crew" },
      ],
    },
    {
      id: "goal",
      question: t("quiz.q3"),
      options: [
        { label: t("quiz.q3o1"), value: "explore" },
        { label: t("quiz.q3o2"), value: "performance" },
        { label: t("quiz.q3o3"), value: "work" },
        { label: t("quiz.q3o4"), value: "group" },
      ],
    },
  ];

  const EXPLANATIONS: Record<BundleKey, string> = {
    starter: t("quiz.starterExplanation"),
    athlete: t("quiz.athleteExplanation"),
    office: t("quiz.officeExplanation"),
    "big-office": t("quiz.bigOfficeExplanation"),
  };

  const currentQuestion = step >= 1 && step <= QUESTIONS.length ? QUESTIONS[step - 1] : null;

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
          const products = await fetchShopifyProducts(30, "product_type:Bundle OR title:Box");
          if (products) {
            const match = products.find((p) =>
              p.node.title.toLowerCase().includes((BUNDLES_META[rec]?.searchTitle ?? "").toLowerCase())
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
    if (step > 0) { setSelectedOption(null); setStep(step - 1); }
  };

  const handleEmailSubmit = async () => {
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setEmailSending(true);
    try {
      await supabase.from("contact_submissions").insert({
        name: "Måltidsquiz",
        email: trimmed,
        message: `Quiz-resultat: ${result ? (BUNDLES_META[result]?.name ?? "okänt") : "okänt"}`,
      });
    } catch (e) {
      console.error("Quiz email save failed:", e);
    }
    try {
      const claim = await claimOffer(trimmed.toLowerCase());
      if (claim.status === "issued") {
        setOfferCode(claim.code);
        setOfferNotice(null);
        supabase.functions
          .invoke("send-transactional-email", {
            body: {
              templateName: "starter-offer-code",
              recipientEmail: trimmed.toLowerCase(),
              data: { code: claim.code },
              idempotencyKey: `starter-offer-${trimmed.toLowerCase()}`,
            },
          })
          .catch((err) => console.error("offer email failed", err));
      } else if (claim.status === "sold_out") {
        setOfferNotice(t("offer.soldOut"));
      }
    } catch (e) {
      console.error("Quiz offer claim failed:", e);
    } finally {
      setEmailSending(false);
      setStep(step + 1);
    }
  };

  const handleEmailSkip = () => setStep(step + 1);

  const handleAddToCart = async () => {
    if (!shopifyProduct) return;
    await handleAdd(shopifyProduct);
  };

  const handleRestart = () => {
    setStep(0); setAnswers({}); setSelectedOption(null); setResult(null); setShopifyProduct(null);
  };

  const bundle = result ? BUNDLES_META[result] : null;
  const isEmailStep = step === QUESTIONS.length + 1;
  const isResultStep = step === QUESTIONS.length + 2;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--primary))_0%,hsl(var(--secondary))_100%)] opacity-10" />
      <div className="container relative z-10 max-w-2xl mx-auto">
        <div className="text-center space-y-3 mb-10 animate-fade-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">{t("quiz.title")}</h2>
          <p className="text-muted-foreground text-lg">{t("quiz.subtitle")}</p>
        </div>

        <Card className="p-8 md:p-10 border-border/50 shadow-[var(--shadow-elevated)] bg-card/80 backdrop-blur-xs animate-fade-up">
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-semibold">{t("quiz.quizTitle")}</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">{t("quiz.quizDesc")}</p>
              </div>
              <Button onClick={handleNext} size="lg" className="rounded-full font-semibold px-8">
                {t("quiz.start")} <ArrowRight className="w-4 h-4 ml-1" />
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
              <p className="text-xs text-muted-foreground">{t("quiz.question")} {step} {t("quiz.of")} {QUESTIONS.length}</p>
              <h3 className="font-heading text-xl font-semibold">{currentQuestion.question}</h3>
              <div className="grid gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedOption(opt.value)}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                      selectedOption === opt.value
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-primary/40 shrink-0" />
                    <span className="font-medium text-foreground">{opt.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={handleBack} className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-1" /> {t("quiz.back")}
                </Button>
                <Button onClick={handleNext} disabled={!selectedOption} className="rounded-full font-semibold px-6">
                  {step === QUESTIONS.length ? t("quiz.seeResult") : t("quiz.next")} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {isEmailStep && (
            <div className="space-y-6 text-center animate-fade-up">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-semibold">{t("quiz.emailTitle")}</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">{t("quiz.emailDesc")}</p>
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("quiz.emailPlaceholder")}
                  className="flex-1 rounded-full"
                  aria-label={t("quiz.emailPlaceholder")}
                />
                <Button type="submit" disabled={emailSending} size="lg" className="rounded-full font-semibold px-8">
                  {emailSending ? <Loader2 className="w-4 h-4 animate-spin" /> : t("quiz.emailSubmit")}
                </Button>
              </form>
              {emailError && <p className="text-sm text-destructive">{t("quiz.emailError")}</p>}
              <p className="text-xs text-muted-foreground">
                {t("quiz.emailConsent")}{" "}
                <Link to="/integritetspolicy" className="underline">{t("quiz.privacyPolicy")}</Link>
              </p>
              <button
                onClick={handleEmailSkip}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                {t("quiz.emailSkip")}
              </button>
            </div>
          )}

          {isResultStep && bundle && (
            <div className="space-y-6 text-center animate-fade-up">
              {(offerCode || offerNotice) && (
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 max-w-md mx-auto">
                  {offerCode ? (
                    <>
                      <p className="text-xs text-muted-foreground">{offerNotice ?? t("offer.yourCode")}</p>
                      <p className="font-mono text-lg font-bold tracking-wider mt-1">{offerCode}</p>
                      <p className="text-xs text-muted-foreground mt-2">{t("offer.codeHint")}</p>
                    </>
                  ) : (
                    <p className="text-sm font-semibold">{offerNotice}</p>
                  )}
                </div>
              )}
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t("quiz.yourMatch")}</p>
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                <img src={bundle.image} alt={`${bundle.name} – rekommenderat PLÄNTLY-paket`} className="w-full h-full object-contain" />
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold">{bundle.name}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{result ? EXPLANATIONS[result] : ""}</p>
              {shopifyProduct && (
                (() => {
                  const p = shopifyProduct.node.priceRange.minVariantPrice;
                  const amount = parseFloat(p.amount);
                  const savings = getBundleSavings(shopifyProduct.node.title, amount);
                  return (
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-primary">
                        {p.currencyCode} {amount.toFixed(0)}
                      </p>
                      {savings && savings.savingsPercent > 0 && (
                        <div className="flex items-center gap-2 justify-center">
                          <span className="text-sm text-muted-foreground line-through">
                            {p.currencyCode} {savings.fullPrice}
                          </span>
                          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-0.5">
                            {t("bundles.save")} {savings.savingsPercent}%
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                {loadingProduct ? (
                  <Button disabled size="lg" className="rounded-full font-semibold px-8">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("quiz.loading")}
                  </Button>
                ) : shopifyProduct ? (
                  <Button onClick={handleAddToCart} disabled={isLoading} size="lg" className="rounded-full font-semibold px-8">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingCart className="w-4 h-4 mr-2" /> {t("quiz.addToCart")}</>}
                  </Button>
                ) : null}
                <Button variant="outline" onClick={handleRestart} size="lg" className="rounded-full font-semibold px-8">
                  {t("quiz.retake")}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
      <MixBuilderDialog {...dialogProps} />
    </section>
  );
};

export default MealFinderQuiz;
