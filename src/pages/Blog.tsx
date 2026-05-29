import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useTranslation } from "@/lib/i18n";

type BlogPost = Tables<"blog_posts">;

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { lang, t } = useTranslation();

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .eq("language", lang)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data);
      });
  }, [lang]);

  return (
    <Layout>
      <SEOHead title="Blogg – Protein, hälsosam mat, klimatsmart & snabba recept | PLÄNTLY" description="Tips, guider och recept om protein, hälsosam snabbmat och klimatsmart kost. För alla som vill äta bättre – utan att det tar tid eller kostar planeten." path="/blog" />
      <section className="py-12 md:py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">{t("blog.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("blog.subtitle")}</p>
          </div>
          {posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {posts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="group rounded-2xl bg-card border border-border/50 p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-up space-y-3">
                  <p className="text-xs font-medium text-primary uppercase tracking-wider">{post.category}</p>
                  <h2 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString(lang === "sv" ? "sv-SE" : "en-US") : ""}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">{t("blog.noPosts")}</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
