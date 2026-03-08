import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
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
      <HeroSection />
      <TrustSection />
      <ProductOverview />
      <WhySection />
      <HowItWorks />
      <LifestyleSection />
      <BundleSection />
      <TestimonialsSection />
      <NutritionPreview />
      <FinalCTA />
    </Layout>
  );
};

export default Index;
