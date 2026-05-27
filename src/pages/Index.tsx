import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import StarterPackHighlight from "@/components/home/StarterPackHighlight";
import ProblemSolution from "@/components/home/ProblemSolution";
import ProductOverview from "@/components/home/ProductOverview";
import WhySection from "@/components/home/WhySection";
import HowItWorks from "@/components/home/HowItWorks";
import { lazy, Suspense } from "react";
const LifestyleSection = lazy(() => import("@/components/home/LifestyleSection"));
const BundleSection = lazy(() => import("@/components/home/BundleSection"));
const MealFinderQuiz = lazy(() => import("@/components/home/MealFinderQuiz"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const FinalCTA = lazy(() => import("@/components/home/FinalCTA"));

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="PLÄNTLY — Växtbaserade proteinmåltider på 5 min"
        description="Växtbaserade högprotein-måltider klara på 5 minuter. Snabb, näringsrik och bekväm mat för en aktiv vardag."
        path="/"
      />
      <HeroSection />
      <StarterPackHighlight />
      <TrustSection />
      <ProblemSolution />
      <ProductOverview />
      <WhySection />
      <HowItWorks />
      <Suspense fallback={null}>
        <LifestyleSection />
        <BundleSection />
        <MealFinderQuiz />
        <TestimonialsSection />
        <FinalCTA />
      </Suspense>
    </Layout>
  );
};

export default Index;
