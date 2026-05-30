import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useTranslation } from "@/lib/i18n";

type BlogPost = Tables<"blog_posts">;

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useTranslation();

  useEffect(() => {
    if (!slug) return;
    // Try language-specific slug first, fall back to base slug
    const trySlug = lang === "sv" ? `${slug}-sv` : slug;
    supabase.from("blog_posts").select("*").eq("slug", trySlug).eq("is_published", true).maybeSingle().then(({ data }) => {
      if (data) {
        setPost(data);
        setLoading(false);
      } else {
        supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).maybeSingle().then(({ data: d2 }) => {
          setPost(d2);
          setLoading(false);
        });
      }
    });
  }, [slug, lang]);

  if (loading) {
    return <Layout><div className="container py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div></Layout>;
  }

  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center space-y-4">
          <h1 className="font-heading text-3xl font-bold">{lang === "sv" ? "Inlägget hittades inte" : "Post not found"}</h1>
          <Button asChild variant="outline" className="rounded-full"><Link to="/blog">{t("blog.title")}</Link></Button>
        </div>
      </Layout>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    author: { "@type": "Person", name: post.author || "PLÄNTLY" },
    image: post.cover_image_url || undefined,
  };

  // Real slug as stored in DB (may include `-sv` suffix for Swedish version).
  const realSlug = post.slug;
  const isSv = realSlug.endsWith("-sv");
  const baseSlug = isSv ? realSlug.slice(0, -3) : realSlug;
  const svPath = `/blog/${baseSlug}-sv`;
  const enPath = `/blog/${baseSlug}`;
  const canonicalPath = `/blog/${realSlug}`;
  const postLocale: "sv" | "en" = isSv ? "sv" : "en";

  return (
    <Layout>
      <SEOHead
        title={`${post.title} — PLÄNTLY`}
        description={post.excerpt || post.title}
        path={canonicalPath}
        type="article"
        image={post.cover_image_url || undefined}
        jsonLd={jsonLd}
        locale={postLocale}
        alternates={[
          { hreflang: "sv", path: svPath },
          { hreflang: "en", path: enPath },
          { hreflang: "x-default", path: enPath },
        ]}
      />
      <article className="py-12 md:py-20">
        <div className="container max-w-3xl space-y-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> {t("blog.title")}
          </Link>
          <header className="space-y-4">
            {post.category && <p className="text-xs font-semibold uppercase tracking-widest text-primary">{post.category}</p>}
            <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight">{post.title}</h1>
            {post.excerpt && <p className="text-lg text-muted-foreground">{post.excerpt}</p>}
            <p className="text-sm text-muted-foreground">
              {post.author && <>{post.author} · </>}
              {post.published_at ? new Date(post.published_at).toLocaleDateString(lang === "sv" ? "sv-SE" : "en-US") : ""}
            </p>
          </header>
          {post.content && (
            <div
              className="prose prose-lg max-w-none [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-heading [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-base [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
          <div className="mt-12 rounded-3xl gradient-hero p-10 text-center text-primary-foreground">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">{lang === "sv" ? "Prova PLÄNTLY idag" : "Try PLÄNTLY today"}</h2>
            <Button asChild size="lg" className="rounded-full px-8 font-semibold bg-background text-foreground hover:bg-background/90">
              <Link to="/products">{lang === "sv" ? "Handla nu" : "Shop now"}</Link>
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPostPage;