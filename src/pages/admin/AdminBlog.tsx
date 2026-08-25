import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { BLOG_CATEGORIES } from "@/data/blogCategories";
import { notifySitemapChanged } from "@/lib/searchConsole";

const toDatetimeLocal = (iso: string | null | undefined): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

type BlogPost = Tables<"blog_posts">;

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [isNew, setIsNew] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const startNew = () => {
    setEditing("new"); setIsNew(true);
    setForm({ slug: "", title: "", excerpt: "", content: "", cover_image_url: "", author: "", category: "", language: "en", is_published: false, published_at: null });
  };

  const startEdit = (p: BlogPost) => { setEditing(p.id); setForm({ ...p }); setIsNew(false); };
  const cancel = () => { setEditing(null); setForm({}); setIsNew(false); };

  const save = async () => {
    if (!form['title']?.trim() || !form['slug']?.trim()) { toast.error("Title and slug are required"); return; }
    let publishedAt: string | null = form['published_at'] ?? null;
    if (form['is_published'] && !publishedAt) {
      publishedAt = new Date().toISOString();
    }
    const payload = {
      slug: form['slug'], title: form['title'], excerpt: form['excerpt'], content: form['content'],
      cover_image_url: form['cover_image_url'], author: form['author'], category: form['category'],
      language: form['language'] || "en",
      is_published: form['is_published'], published_at: publishedAt,
    };
    if (isNew) {
      const { error } = await supabase.from("blog_posts").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Post created");
    } else {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing!);
      if (error) { toast.error(error.message); return; }
      toast.success("Post updated");
    }
    // Newly published content: nudge Google to re-crawl the sitemap.
    notifySitemapChanged();
    cancel(); fetchPosts();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast.success("Post deleted"); notifySitemapChanged(); fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Blog Posts</h1>
        <Button onClick={startNew} className="rounded-full gap-2"><Plus className="h-4 w-4" /> New Post</Button>
      </div>

      {editing && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-4">
          <h2 className="font-heading font-semibold">{isNew ? "New Post" : "Edit Post"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-medium">Title *</label><Input value={form['title'] ?? ""} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Slug *</label><Input value={form['slug'] ?? ""} onChange={e => setForm({ ...form, slug: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Author</label><Input value={form['author'] ?? ""} onChange={e => setForm({ ...form, author: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Language *</label>
              <Select value={form['language'] ?? "en"} onValueChange={(v) => setForm({ ...form, language: v, category: "" })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="sv">Svenska</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-medium">Category</label>
              <Select value={form['category'] ?? ""} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((c) => {
                    const label = (form['language'] ?? "en") === "sv" ? c.sv : c.en;
                    return <SelectItem key={c.slug} value={label}>{label}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 sm:col-span-2"><label className="text-xs font-medium">Cover Image URL</label><Input value={form['cover_image_url'] ?? ""} onChange={e => setForm({ ...form, cover_image_url: e.target.value })} className="rounded-xl" /></div>
          </div>
          <div className="space-y-1"><label className="text-xs font-medium">Excerpt</label><Textarea value={form['excerpt'] ?? ""} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="rounded-xl" rows={2} /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Content</label><Textarea value={form['content'] ?? ""} onChange={e => setForm({ ...form, content: e.target.value })} className="rounded-xl" rows={8} /></div>
          <div className="flex items-center gap-2">
            <input id="published" type="checkbox" checked={form['is_published'] ?? false} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
            <label htmlFor="published" className="text-sm">Published</label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">Publish at (optional)</label>
              <Input
                type="datetime-local"
                value={toDatetimeLocal(form['published_at'])}
                onChange={e => setForm({ ...form, published_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="rounded-full gap-2"><Check className="h-4 w-4" /> Save</Button>
            <Button variant="ghost" onClick={cancel} className="rounded-full gap-2"><X className="h-4 w-4" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
          {posts.map(p => {
            const isScheduled = !p.is_published && p.published_at && new Date(p.published_at) > new Date();
            return (
          <div key={p.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between shadow-card">
            <div>
              <p className="font-semibold text-sm">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.author} · {p.category}{!p.is_published && (isScheduled ? " · Scheduled" : " · Draft")}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        );})}
        {posts.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No blog posts yet.</p>}
      </div>
    </div>
  );
};

export default AdminBlog;
