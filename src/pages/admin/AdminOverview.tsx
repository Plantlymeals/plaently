import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, FileText, HelpCircle, MessageSquare, Quote, Package } from "lucide-react";

const AdminOverview = () => {
  const [counts, setCounts] = useState({
    products: 0,
    blog_posts: 0,
    faqs: 0,
    testimonials: 0,
    bundles: 0,
    contact_submissions: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [products, blog, faqs, testimonials, bundles, messages] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("faqs").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("bundles").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        products: products.count ?? 0,
        blog_posts: blog.count ?? 0,
        faqs: faqs.count ?? 0,
        testimonials: testimonials.count ?? 0,
        bundles: bundles.count ?? 0,
        contact_submissions: messages.count ?? 0,
      });
    };
    fetchCounts();
  }, []);

  const cards = [
    { label: "Products", count: counts.products, icon: ShoppingBag },
    { label: "Blog Posts", count: counts.blog_posts, icon: FileText },
    { label: "FAQs", count: counts.faqs, icon: HelpCircle },
    { label: "Testimonials", count: counts.testimonials, icon: Quote },
    { label: "Bundles", count: counts.bundles, icon: Package },
    { label: "Messages", count: counts.contact_submissions, icon: MessageSquare },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ label, count, icon: Icon }) => (
          <div key={label} className="bg-card rounded-2xl border border-border/50 p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{count}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
