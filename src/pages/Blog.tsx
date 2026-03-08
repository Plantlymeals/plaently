import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type BlogPost = Tables<"blog_posts">;

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false }).then(({ data }) => {
      if (data) setPosts(data);
    });
  }, []);

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Blog</h1>
            <p className="text-muted-foreground text-lg">Nutrition science, lifestyle tips, and sustainable food stories.</p>
          </div>

          {posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {posts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="group rounded-2xl bg-card border border-border/50 p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-up space-y-3">
                  <p className="text-xs font-medium text-primary uppercase tracking-wider">{post.category}</p>
                  <h2 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No posts yet. Check back soon!</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
