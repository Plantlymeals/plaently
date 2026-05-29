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
        title="PLÄNTLY | Hälsosam proteinmat på 5 min – 20g protein per måltid"
        description="Snabb, hälsosam och klimatsmart mat med 20g protein per portion. Pasta bolognese, carbonara, yellow curry & rökiga linser – klara på 5 minuter. Fri frakt från 399 kr."
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
