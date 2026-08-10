import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useTranslation } from "@/lib/i18n";
import {
  BLOG_CATEGORIES,
  getCategoryDef,
  getCategoryDisplayName,
  getCategorySlug,
} from "@/data/blogCategories";
import InternalLinks from "@/components/InternalLinks";
import { getCategoryLandingLinks } from "@/data/internalLinks";

type BlogPost = Tables<"blog_posts">;

const BlogCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const def = slug ? getCategoryDef(slug) : null;
  const displayName = def ? (lang === "sv" ? def.sv : def.en) : null;

  useEffect(() => {
    if (!slug || !def) {
      setLoading(false);
      return;
    }
    // Filter by either EN or SV display name for the active language to be safe
    const names = [def.en, def.sv];
    const now = new Date().toISOString();
    supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .lte("published_at", now)
      .eq("language", lang)
      .in("category", names)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data);
        setLoading(false);
      });
  }, [slug, lang, def]);

  if (!def) {
    return <Navigate to="/blog" replace />;
  }

  const title = lang === "sv"
    ? `${def.sv} — Blogg | PLÄNTLY`
    : `${def.en} — Blog | PLÄNTLY`;
  const description = def.description[lang];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "sv" ? "Hem" : "Home", item: "https://plaently.com" },
      { "@type": "ListItem", position: 2, name: lang === "sv" ? "Blogg" : "Blog", item: "https://plaently.com/blog" },
      { "@type": "ListItem", position: 3, name: displayName!, item: `https://plaently.com/blog/category/${def.slug}` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: displayName,
    description,
    url: `https://plaently.com/blog/category/${def.slug}`,
    inLanguage: lang === "sv" ? "sv-SE" : "en-GB",
  };

  return (
    <Layout>
      <SEOHead
        title={title}
        description={description}
        path={`/blog/category/${def.slug}`}
        locale={lang}
        jsonLd={[breadcrumbSchema, collectionSchema]}
      />
      <section className="py-12 md:py-20">
        <div className="container max-w-5xl space-y-10">
          <Breadcrumbs
            items={[
              { label: lang === "sv" ? "Blogg" : "Blog", path: "/blog" },
              { label: displayName!, path: `/blog/category/${def.slug}` },
            ]}
            lang={lang}
            emitSchema={false}
            className="mb-0"
          />
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> {lang === "sv" ? "Alla inlägg" : "All posts"}
          </Link>
          <header className="text-center space-y-4 animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{lang === "sv" ? "Kategori" : "Category"}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{displayName}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{description}</p>
          </header>

          {/* All categories nav */}
          <nav className="flex flex-wrap gap-2 justify-center" aria-label={lang === "sv" ? "Bloggkategorier" : "Blog categories"}>
            {BLOG_CATEGORIES.map((cat) => {
              const active = cat.slug === def.slug;
              return (
                <Link
                  key={cat.slug}
                  to={`/blog/category/${cat.slug}`}
                  className={`text-xs font-medium rounded-full px-4 py-2 border transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40"
                  }`}
                >
                  {lang === "sv" ? cat.sv : cat.en}
                </Link>
              );
            })}
          </nav>

          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
          ) : posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="group rounded-2xl bg-card border border-border/50 p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 space-y-3">
                  <p className="text-xs font-medium text-primary uppercase tracking-wider">{post.category}</p>
                  <h2 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString(lang === "sv" ? "sv-SE" : "en-US") : ""}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">{lang === "sv" ? "Inga inlägg ännu i den här kategorin." : "No posts in this category yet."}</p>
          )}

          <InternalLinks
            title={lang === "sv" ? "Handla efter behov" : "Shop by need"}
            links={getCategoryLandingLinks(def.slug, lang)}
          />
        </div>
      </section>
    </Layout>
  );
};

export default BlogCategoryPage;