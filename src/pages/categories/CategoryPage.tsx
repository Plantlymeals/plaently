import { Link } from "@/lib/router-compat";
import { ArrowRight, Check } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import {
  getCategoryContent,
  enSlugByKey,
  svSlugByKey,
  type CategoryKey,
} from "@/data/categoryContent";

interface Props {
  categoryKey: CategoryKey;
}

const CategoryPage = ({ categoryKey }: Props) => {
  const { lang } = useTranslation();
  const c = getCategoryContent(categoryKey, lang);

  const enSlug = enSlugByKey[categoryKey];
  const svSlug = svSlugByKey[categoryKey];

  const alternates = [
    { hreflang: "en", path: `/${enSlug}` },
    { hreflang: "sv", path: `/${svSlug}` },
    { hreflang: "x-default", path: `/${svSlug}` },
  ];

  return (
    <Layout>
      <SEOHead
        title={c.metaTitle}
        description={c.metaDescription}
        path={`/${c.slug}`}
        locale={lang}
        alternates={alternates}
      />

      {/* Hero */}
      <section className="gradient-hero">
        <div className="container py-20 md:py-28 text-center text-primary-foreground space-y-6 animate-fade-up">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-widest opacity-80">{c.keywordLabel}</p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">{c.h1}</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">{c.intro}</p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button asChild size="lg" className="rounded-full px-8 font-semibold bg-background text-foreground hover:bg-background/90">
              <Link to="/products">{c.ctaText}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: lang === "sv" ? "Produkter" : "Products", path: "/products" },
              { label: c.breadcrumbName, path: `/${c.slug}` },
            ]}
            lang={lang}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.benefits.map((b) => (
              <div key={b.title} className="rounded-2xl bg-card border border-border/50 p-6 shadow-card hover:shadow-elevated transition-all">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Check className="h-5 w-5" />
                </div>
                <h2 className="font-heading font-semibold text-base mb-2">{b.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Long-form sections */}
      <section className="pb-16 md:pb-24">
        <div className="container max-w-3xl space-y-12">
          {c.sections.map((s) => (
            <article key={s.heading} className="space-y-4">
              <h2 className="font-heading text-2xl md:text-3xl font-bold">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">{p}</p>
              ))}
            </article>
          ))}
        </div>
      </section>

      {/* Related categories — internal linking for SEO */}
      {c.related.length > 0 && (
        <section className="pb-16 md:pb-20">
          <div className="container max-w-3xl">
            <h2 className="font-heading text-xl md:text-2xl font-bold mb-6">
              {lang === "sv" ? "Utforska mer" : "Explore more"}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {c.related.map((r) => (
                <Link
                  key={r.slug}
                  to={r.slug}
                  className="rounded-2xl bg-card border border-border/50 p-5 shadow-card hover:shadow-elevated transition-all flex items-center justify-between group"
                >
                  <span className="font-heading font-semibold text-sm">{r.label}</span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-secondary/40">
        <div className="container max-w-3xl">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-10">FAQ</h2>
          <div className="space-y-4">
            {c.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-card border border-border/50 p-6 shadow-card">
                <summary className="cursor-pointer font-heading font-semibold text-base list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 gradient-hero">
        <div className="container text-center text-primary-foreground space-y-6">
          <h2 className="font-heading text-3xl md:text-5xl font-bold">{c.ctaHeadline}</h2>
          <Button asChild size="lg" className="rounded-full px-8 font-semibold bg-background text-foreground hover:bg-background/90">
            <Link to="/products" className="inline-flex items-center gap-2">{c.ctaText} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;