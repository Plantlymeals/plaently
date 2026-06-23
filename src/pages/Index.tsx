import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { useTranslation } from "@/lib/i18n";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import StarterPackHighlight from "@/components/home/StarterPackHighlight";
import ProblemSolution from "@/components/home/ProblemSolution";
import ProductOverview from "@/components/home/ProductOverview";
import WhySection from "@/components/home/WhySection";
import HowItWorks from "@/components/home/HowItWorks";
import NutritionPreview from "@/components/home/NutritionPreview";
import { lazy, Suspense, Component, ReactNode } from "react";

const LifestyleSection   = lazy(() => import("@/components/home/LifestyleSection"));
const BundleSection      = lazy(() => import("@/components/home/BundleSection"));
const MealFinderQuiz     = lazy(() => import("@/components/home/MealFinderQuiz"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const FinalCTA           = lazy(() => import("@/components/home/FinalCTA"));

// ─── ErrorBoundary ───────────────────────────────────────────────────────────
// Isolerar varje lazy-sektion så att en krasch inte tar ner resten av sidan.
class SectionErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("[SectionErrorBoundary]", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── LazySection ─────────────────────────────────────────────────────────────
// Wrapper som kombinerar ErrorBoundary + Suspense med en minHeight-placeholder
// för att förhindra CLS (Cumulative Layout Shift) medan komponenten laddas.
const LazySection = ({
  children,
  height = 400,
}: {
  children: ReactNode;
  height?: number;
}) => (
  <SectionErrorBoundary>
    <Suspense fallback={<div style={{ minHeight: `${height}px` }} aria-hidden="true" />}>
      {children}
    </Suspense>
  </SectionErrorBoundary>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const Index = () => {
  const { t, lang } = useTranslation();

  return (
    <Layout>
      <SEOHead
        title={t("seo.home.title")}
        description={t("seo.home.description")}
        path="/"
        locale={lang}
        alternates={[
          { hreflang: "sv", path: "/" },
          { hreflang: "en", path: "/" },
          { hreflang: "x-default", path: "/" },
        ]}
      />

      {/* ── Eager-laddade sektioner (kritiska för first paint) ── */}
      <HeroSection />
      <StarterPackHighlight />
      <TrustSection />
      <ProblemSolution />
      <ProductOverview />
      <NutritionPreview />
      <WhySection />
      <HowItWorks />

      {/* ── Lazy-laddade sektioner (egna Suspense = oberoende laddning) ── */}
      <LazySection height={500}><LifestyleSection /></LazySection>
      <LazySection height={600}><BundleSection /></LazySection>
      <LazySection height={500}><MealFinderQuiz /></LazySection>
      <LazySection height={400}><TestimonialsSection /></LazySection>
      <LazySection height={300}><FinalCTA /></LazySection>
    </Layout>
  );
};

export default Index;
