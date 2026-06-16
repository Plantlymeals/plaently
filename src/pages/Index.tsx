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
import { lazy, Suspense } from "react";
const LifestyleSection = lazy(() => import("@/components/home/LifestyleSection"));
const BundleSection = lazy(() => import("@/components/home/BundleSection"));
const MealFinderQuiz = lazy(() => import("@/components/home/MealFinderQuiz"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const FinalCTA = lazy(() => import("@/components/home/FinalCTA"));

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
