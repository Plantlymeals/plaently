import Layout from "@/components/Layout";
import { useTranslation } from "@/lib/i18n";
import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import StarterPackHighlight from "@/components/home/StarterPackHighlight";
import ProblemSolution from "@/components/home/ProblemSolution";
import ProductOverview from "@/components/home/ProductOverview";
import WhySection from "@/components/home/WhySection";
import HowItWorks from "@/components/home/HowItWorks";
import NutritionPreview from "@/components/home/NutritionPreview";
import InternalLinks from "@/components/InternalLinks";
import { getLinks, HOME_LINK_KEYS } from "@/data/internalLinks";
import { Component, ReactNode } from "react";
// Statiska imports: React.lazy + Suspense fick SSR-strömmen att time:a ut
// ("Stream lifetime exceeded") på startsidan. Sektionerna hämtar sin data i
// useEffect (klientsidan), så de kan renderas direkt under SSR.
import LifestyleSection from "@/components/home/LifestyleSection";
import BundleSection from "@/components/home/BundleSection";
import MealFinderQuiz from "@/components/home/MealFinderQuiz";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FinalCTA from "@/components/home/FinalCTA";

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
  override componentDidCatch(error: Error) {
    console.error("[SectionErrorBoundary]", error);
  }
  override render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── LazySection ─────────────────────────────────────────────────────────────
// Isolerar varje sektion i en egen ErrorBoundary. Ingen Suspense här längre —
// den blockerade SSR-strömmen.
const LazySection = ({
  children,
  height: _height = 400,
}: {
  children: ReactNode;
  height?: number;
}) => <SectionErrorBoundary>{children}</SectionErrorBoundary>;

// ─── Page ─────────────────────────────────────────────────────────────────────
export const HOME_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://plaently.com/#organization",
      name: "PLÄNTLY AB",
      url: "https://plaently.com",
      logo: "https://plaently.com/images/logo.png",
      description: "Växtbaserade proteinmåltider med 20g protein — klara på 5 minuter.",
      foundingDate: "2025",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Vretensborgsvägen 5",
        postalCode: "126 30",
        addressLocality: "Hägersten",
        addressCountry: "SE",
      },
      email: "hello@plaently.com",
      sameAs: ["https://www.instagram.com/plaently"],
    },
    {
      "@type": "WebSite",
      "@id": "https://plaently.com/#website",
      url: "https://plaently.com",
      name: "PLÄNTLY",
      publisher: { "@id": "https://plaently.com/#organization" },
      inLanguage: ["sv-SE", "en-GB"],
    },
  ],
};

const Index = () => {
  const { t, lang } = useTranslation();

  return (
    <Layout>
      {/* ── Eager-laddade sektioner (kritiska för first paint) ── */}
      <HeroSection />
      <StarterPackHighlight />
      <TrustSection />
      <ProblemSolution />
      <BundleSection />
      <ProductOverview />
      <NutritionPreview />
      <WhySection />
      <HowItWorks />

      {/* Keyword-anchored internal links to the commercial landing pages */}
      <section className="py-14 md:py-20">
        <div className="container max-w-5xl">
          <InternalLinks
            title={lang === "sv" ? "Utforska PLÄNTLY" : "Explore PLÄNTLY"}
            links={getLinks(HOME_LINK_KEYS, lang)}
          />
        </div>
      </section>

      {/* ── Lazy-laddade sektioner (egna Suspense = oberoende laddning) ── */}
      <LazySection height={500}><LifestyleSection /></LazySection>
      <LazySection height={500}><MealFinderQuiz /></LazySection>
      <LazySection height={400}><TestimonialsSection /></LazySection>
      <LazySection height={300}><FinalCTA /></LazySection>
    </Layout>
  );
};

export default Index;
