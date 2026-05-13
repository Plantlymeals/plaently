import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import StarterPackHighlight from "@/components/home/StarterPackHighlight";
import ProblemSolution from "@/components/home/ProblemSolution";
import ProductOverview from "@/components/home/ProductOverview";
import WhySection from "@/components/home/WhySection";
import HowItWorks from "@/components/home/HowItWorks";
import LifestyleSection from "@/components/home/LifestyleSection";
import BundleSection from "@/components/home/BundleSection";
import MealFinderQuiz from "@/components/home/MealFinderQuiz";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCTA from "@/components/home/FinalCTA";

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
      <LifestyleSection />
      <BundleSection />
      <MealFinderQuiz />
      <TestimonialsSection />
      <FinalCTA />
    </Layout>
  );
};

export default Index;
