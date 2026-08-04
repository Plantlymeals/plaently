import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DOMPurify from "dompurify";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useTranslation } from "@/lib/i18n";
import { getCategorySlug } from "@/data/blogCategories";
import InternalLinks from "@/components/InternalLinks";
import { getCategoryLandingLinks } from "@/data/internalLinks";

type BlogPost = Tables<"blog_posts"> & { translation_slug?: string | null };

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const { lang, t, setLang } = useTranslation();

  // Load the post by its exact slug (slugs are unique across languages).
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle()
      .then(({ data }) => {
        setPost(data as BlogPost | null);
        setLoading(false);
      });
  }, [slug]);

  // Keep the UI language in sync with the post's language so the chrome/translations
  // match the content the user is reading.
  useEffect(() => {
    if (post && (post.language === "sv" || post.language === "en") && post.language !== lang) {
      setLang(post.language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.slug]);

  // When the user toggles the header language while reading a post, navigate to
  // the translated version if one exists.
  useEffect(() => {
    if (!post) return;
    if (post.language === lang) return;
    if (post.translation_slug) {
      navigate(`/blog/${post.translation_slug}`, { replace: true });
    }
  }, [lang, post, navigate]);

  // Load related posts in same category + language
  useEffect(() => {
    if (!post?.category) {
      setRelated([]);
      return;
    }
    supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .eq("language", post.language)
      .eq("category", post.category)
      .neq("slug", post.slug)
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setRelated(data);
      });
  }, [post?.slug, post?.category, post?.language]);

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

  // Real slug as stored in DB.
  const realSlug = post.slug;
  const postLocale: "sv" | "en" = post.language === "sv" ? "sv" : "en";
  const canonicalPath = `/blog/${realSlug}`;
  const translationSlug = post.translation_slug ?? null;
  const svPath = postLocale === "sv" ? canonicalPath : translationSlug ? `/blog/${translationSlug}` : canonicalPath;
  const enPath = postLocale === "en" ? canonicalPath : translationSlug ? `/blog/${translationSlug}` : canonicalPath;
  const canonicalUrl = `https://plaently.com${canonicalPath}`;
  const categorySlug = getCategorySlug(post.category);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: { "@type": "Person", name: post.author || "PLÄNTLY" },
    image: post.cover_image_url || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    publisher: {
      "@type": "Organization",
      name: "PLÄNTLY",
      logo: { "@type": "ImageObject", url: "https://plaently.com/images/logo.png" },
    },
    inLanguage: postLocale === "sv" ? "sv-SE" : "en-GB",
    ...(post.category ? { articleSection: post.category } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: postLocale === "sv" ? "Hem" : "Home", item: "https://plaently.com" },
      { "@type": "ListItem", position: 2, name: postLocale === "sv" ? "Blogg" : "Blog", item: "https://plaently.com/blog" },
      ...(categorySlug && post.category
        ? [{ "@type": "ListItem", position: 3, name: post.category, item: `https://plaently.com/blog/category/${categorySlug}` }]
        : []),
      { "@type": "ListItem", position: categorySlug ? 4 : 3, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <Layout>
      <SEOHead
        title={`${post.title} — PLÄNTLY`}
        description={post.excerpt || post.title}
        path={canonicalPath}
        type="article"
        image={post.cover_image_url || undefined}
        jsonLd={[blogPostingSchema, breadcrumbSchema]}
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
            {post.category && (
              categorySlug ? (
                <Link to={`/blog/category/${categorySlug}`} className="inline-block text-xs font-semibold uppercase tracking-widest text-primary hover:underline">
                  {post.category}
                </Link>
              ) : (
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">{post.category}</p>
              )
            )}
            <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight">{post.title}</h1>
            {post.excerpt && <p className="text-lg text-muted-foreground">{post.excerpt}</p>}
            <p className="text-sm text-muted-foreground">
              {post.author && <>{post.author} · </>}
              {post.published_at ? new Date(post.published_at).toLocaleDateString(postLocale === "sv" ? "sv-SE" : "en-GB") : ""}
            </p>
          </header>
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full rounded-2xl object-cover aspect-[16/9]"
              loading="lazy"
            />
          )}
          {post.content && (
            <div
              className="prose prose-lg max-w-none [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-heading [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-base [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />
          )}

          {related.length > 0 && (
            <section className="pt-8 border-t border-border/50 space-y-6">
              <h2 className="font-heading text-xl md:text-2xl font-bold">
                {postLocale === "sv" ? "Läs vidare" : "Related reads"}
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} to={`/blog/${r.slug}`} className="group rounded-2xl bg-card border border-border/50 p-5 shadow-card hover:shadow-elevated transition-all space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">{r.category}</p>
                    <p className="font-heading font-semibold text-sm leading-snug group-hover:text-primary transition-colors">{r.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Keyword-anchored links from editorial content into landing pages */}
          <section className="pt-8 border-t border-border/50">
            <InternalLinks
              title={postLocale === "sv" ? "Utforska vidare" : "Explore further"}
              links={getCategoryLandingLinks(categorySlug, postLocale === "sv" ? "sv" : "en")}
            />
          </section>

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