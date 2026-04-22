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
import NutritionPreview from "@/components/home/NutritionPreview";
import FinalCTA from "@/components/home/FinalCTA";

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Healthy Fast Food | High Protein Plant-Based Meals | PLÄNTLY"
        description="Discover 100% plant-based high-protein meals ready in 5 minutes. Healthy fast food for modern lifestyles."
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
      <NutritionPreview />
      <FinalCTA />
    </Layout>
  );
};

export default Index;
