import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const blogPosts = [
  { slug: "plant-protein-guide", title: "The Complete Guide to Plant-Based Protein", excerpt: "Everything you need to know about getting enough protein from plants.", date: "Mar 1, 2026", category: "Nutrition" },
  { slug: "office-meals", title: "5 Ways to Eat Better at the Office", excerpt: "Simple strategies for healthier workday meals without meal prep.", date: "Feb 20, 2026", category: "Lifestyle" },
  { slug: "sustainable-food", title: "Why Sustainable Food Matters", excerpt: "The environmental impact of food choices and how plant-based meals help.", date: "Feb 10, 2026", category: "Sustainability" },
  { slug: "protein-after-workout", title: "Post-Workout Nutrition: A Science-Based Guide", excerpt: "When and what to eat after training for optimal recovery.", date: "Jan 28, 2026", category: "Fitness" },
];

const Blog = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container space-y-12">
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Blog</h1>
            <p className="text-muted-foreground text-lg">Nutrition science, lifestyle tips, and sustainable food stories.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {blogPosts.map(({ slug, title, excerpt, date, category }) => (
              <Link key={slug} to={`/blog/${slug}`} className="group rounded-2xl bg-card border border-border/50 p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-fade-up space-y-3">
                <p className="text-xs font-medium text-primary uppercase tracking-wider">{category}</p>
                <h2 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">{title}</h2>
                <p className="text-sm text-muted-foreground">{excerpt}</p>
                <p className="text-xs text-muted-foreground">{date}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
