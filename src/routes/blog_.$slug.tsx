import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import BlogPost from "@/pages/BlogPost";
import { getBlogPost } from "@/lib/blog.functions";
import Layout from "@/components/Layout";
import { getCategorySlug } from "@/data/blogCategories";

const BASE = "https://plaently.com";

export const Route = createFileRoute("/blog_/$slug")({
  loader: async ({ params }) => {
    const result = await getBlogPost({ data: { slug: params.slug } });
    // Only a confirmed miss becomes a 404 — a slow/failing upstream must not
    // de-index a real article.
    if (result.confirmedMiss) throw notFound();
    return result;
  },
  head: ({ params, loaderData }) => {
    const post = loaderData?.post ?? null;
    const url = `${BASE}/blog/${params.slug}`;
    if (!post) {
      return {
        meta: [{ title: "Inlägget hittades inte — PLÄNTLY" }, { name: "robots", content: "noindex, follow" }],
      };
    }
    const locale = post.language === "en" ? "en" : "sv";
    const title = `${post.title} — PLÄNTLY`;
    const description = post.excerpt || post.title;
    const categorySlug = getCategorySlug(post.category);
    const image = post.cover_image_url || undefined;
    const translationPath = post.translation_slug ? `/blog/${post.translation_slug}` : `/blog/${params.slug}`;
    const enPath = locale === "en" ? `/blog/${params.slug}` : translationPath;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: locale === "sv" ? "sv_SE" : "en_GB" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [
        { rel: "canonical", href: url },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description,
            datePublished: post.published_at,
            dateModified: post.updated_at || post.published_at,
            author: { "@type": "Person", name: post.author || "PLÄNTLY" },
            ...(image ? { image } : {}),
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            publisher: {
              "@type": "Organization",
              name: "PLÄNTLY",
              logo: { "@type": "ImageObject", url: `${BASE}/images/logo.png` },
            },
            inLanguage: locale === "sv" ? "sv-SE" : "en-GB",
            ...(post.category ? { articleSection: post.category } : {}),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: locale === "sv" ? "Hem" : "Home", item: BASE },
              { "@type": "ListItem", position: 2, name: locale === "sv" ? "Blogg" : "Blog", item: `${BASE}/blog` },
              ...(categorySlug && post.category
                ? [
                    {
                      "@type": "ListItem",
                      position: 3,
                      name: post.category,
                      item: `${BASE}/blog/category/${categorySlug}`,
                    },
                  ]
                : []),
              { "@type": "ListItem", position: categorySlug ? 4 : 3, name: post.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: BlogPostNotFound,
  component: BlogPost,
});

function BlogPostNotFound() {
  return (
    <Layout>
      <div className="container py-20 text-center space-y-4">
        <h1 className="font-heading text-3xl font-bold">Inlägget hittades inte</h1>
        <p className="text-muted-foreground">Sidan du sökte finns inte längre.</p>
        <Link to="/blog" className="inline-block rounded-full border border-border px-6 py-2 hover:text-primary">
          Till bloggen
        </Link>
      </div>
    </Layout>
  );
}
