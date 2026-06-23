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
import { lazy, Suspense, Component } from "react";

const LifestyleSection = lazy(() => import("@/components/home/LifestyleSection"));
const BundleSection = lazy(() => import("@/components/home/BundleSection"));
const MealFinderQuiz = lazy(() => import("@/components/home/MealFinderQuiz"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const FinalCTA = lazy(() => import("@/components/home/FinalCTA"));

// ErrorBoundary – förhindrar att en kraschad sektion tar ner hela sidan
class SectionErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("Section failed to load:", error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// Wrapper: ErrorBoundary + Suspense med CLS-förebyggande placeholder
const LazySection = ({ children, height = 400 }: { children: React.ReactNode; height?: number }) => (
  <SectionErrorBoundary>
    <Suspense fallback={<div style={{ minHeight: `${height}px` }} aria-hidden="true" />}>
      {children}
    </Suspense>
  </SectionErrorBoundary>
);

const Index = () => {
  const { t, lang } = useTranslation();

  return (
    <Layout>
      <SEOHead
        title={t("seo.home.title")}
        description={t("seo.home.description")}
        path="/"
        locale={lang}
      />

      {/* Eager – kritiska för first paint, behåll originalordning */}
      <HeroSection />
      <StarterPackHighlight />
      <TrustSection />
      <ProblemSolution />
      <ProductOverview />
      <WhySection />
      <HowItWorks />

      {/* Lazy – egna Suspense per komponent förhindrar blockering */}
      <LazySection height={500}><LifestyleSection /></LazySection>
      <LazySection height={450}><BundleSection /></LazySection>
      <LazySection height={400}><MealFinderQuiz /></LazySection>
      <LazySection height={450}><TestimonialsSection /></LazySection>
      <LazySection height={300}><FinalCTA /></LazySection>
    </Layout>
  );
};

export default Index;
