import { Link, useSearchParams } from "@/lib/router-compat";
import { getRouteApi } from "@tanstack/react-router";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import Layout from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useTranslation } from "@/lib/i18n";
import { BLOG_CATEGORIES, getCategorySlug } from "@/data/blogCategories";
import InternalLinks from "@/components/InternalLinks";
import { getLinks, HOME_LINK_KEYS } from "@/data/internalLinks";

type BlogPost = Tables<"blog_posts">;

// getRouteApi avoids importing the route file (which imports this page).
const routeApi = getRouteApi("/blog");

const Blog = () => {
  // Server-rendered Swedish posts so /blog is not an empty shell for crawlers.
  const initialPosts = (routeApi.useLoaderData()?.posts ?? []) as unknown as BlogPost[];
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const { lang, t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategorySlug = searchParams.get("category");

  useEffect(() => {
    const now = new Date().toISOString();
    supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .lte("published_at", now)
      // Swedish is the only published language on the site; never follow the
      // language store here or the list would link to URLs that 301.
      .eq("language", "sv")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data);
      });
  }, []);

  const filteredPosts = useMemo(() => {
    if (!activeCategorySlug) return posts;
    return posts.filter((p) => getCategorySlug(p.category) === activeCategorySlug);
  }, [posts, activeCategorySlug]);

  const setCategory = (slug: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set("category", slug);
    else next.delete("category");
    setSearchParams(next, { replace: true });
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "sv" ? "Hem" : "Home", item: "https://plaently.com" },
      { "@type": "ListItem", position: 2, name: lang === "sv" ? "Blogg" : "Blog", item: "https://plaently.com/blog" },
    ],
  };

  return (
    <Layout>
      <SEOHead
        title={lang === "sv"
          ? "Blogg | Protein, Hälsa & Växtbaserad Mat — PLÄNTLY"
          : "Blog | Protein, Health & Plant-Based Food — PLÄNTLY"}
        description={lang === "sv"
          ? "Tips och inspiration om växtbaserat protein, hälsosam snabbmat och hur du äter bättre utan att kompromissa med tid eller smak."
          : "Tips and inspiration about plant-based protein, healthy fast food and how to eat better without compromising on time or taste."}
        ogTitle={lang === "sv"
          ? "Blogg | Protein, Hälsa & Hälsosam Snabbmat — PLÄNTLY"
          : "Blog | Protein, Health & Healthy Fast Food — PLÄNTLY"}
        ogDescription={lang === "sv"
          ? "Tips, råd och inspiration om växtbaserat protein, hälsosam snabbmat och hur du äter bättre utan att kompromissa med tid."
          : "Tips, advice and inspiration about plant-based protein, healthy fast food and eating better without compromising on time."}
        path="/blog"
        locale={lang}
        routeOwnsMetadata={lang === "sv"}
        routeOwnsLinks
        jsonLd={breadcrumbSchema}
      />
      <section className="py-12 md:py-20">
        <div className="container space-y-12">
          <Breadcrumbs items={[{ label: lang === "sv" ? "Blogg" : "Blog", path: "/blog" }]} lang={lang} emitSchema={false} className="mb-0" />
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{t("blog.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("blog.subtitle")}</p>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={`text-xs font-medium rounded-full px-4 py-2 border transition-colors ${
                !activeCategorySlug
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40"
              }`}
            >
              {lang === "sv" ? "Alla" : "All"}
            </button>
            {BLOG_CATEGORIES.map((cat) => {
              const label = lang === "sv" ? cat.sv : cat.en;
              const active = activeCategorySlug === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setCategory(cat.slug)}
                  className={`text-xs font-medium rounded-full px-4 py-2 border transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {filteredPosts.map((post) => {
                const catSlug = getCategorySlug(post.category);
                return (
                  <article key={post.slug} className="group rounded-2xl bg-card border border-border/50 p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-up space-y-3">
                    {post.category && catSlug ? (
                      <Link
                        to={`/blog/category/${catSlug}`}
                        className="inline-block text-xs font-medium text-primary uppercase tracking-wider hover:underline"
                      >
                        {post.category}
                      </Link>
                    ) : post.category ? (
                      <p className="text-xs font-medium text-primary uppercase tracking-wider">{post.category}</p>
                    ) : null}
                    <Link to={`/blog/${post.slug}`} className="block space-y-3">
                      <h2 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">{post.title}</h2>
                      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                      <p className="text-xs text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString(lang === "sv" ? "sv-SE" : "en-US") : ""}</p>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">{t("blog.noPosts")}</p>
          )}

          <div className="max-w-4xl mx-auto pt-4">
            <InternalLinks
              title={lang === "sv" ? "Handla efter behov" : "Shop by need"}
              links={getLinks(HOME_LINK_KEYS, lang)}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
