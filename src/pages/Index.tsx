import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
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
      <SEOHead
        title="PLÄNTLY — Växtbaserade proteinmåltider | Högprotein veganska färdigrätter"
        description="PLÄNTLY är en ny generation av växtbaserad snabbmat — högt protein, balanserad näring och bekväma måltider för människor i farten. 🌱"
        path="/"
      />
      <HeroSection />
      <TrustSection />
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
