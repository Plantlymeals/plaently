import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Testimonial = Tables<"testimonials">;

const AdminTestimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [isNew, setIsNew] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    if (data) setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const startNew = () => { setEditing("new"); setIsNew(true); setForm({ quote: "", author_name: "", author_role: "", sort_order: items.length + 1, is_published: true }); };
  const startEdit = (t: Testimonial) => { setEditing(t.id); setForm({ ...t }); setIsNew(false); };
  const cancel = () => { setEditing(null); setForm({}); setIsNew(false); };

  const save = async () => {
    if (!form.quote?.trim() || !form.author_name?.trim()) { toast.error("Quote and author name are required"); return; }
    const payload = { quote: form.quote, author_name: form.author_name, author_role: form.author_role, sort_order: form.sort_order ?? 0, is_published: form.is_published };
    if (isNew) {
      const { error } = await supabase.from("testimonials").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Testimonial created");
    } else {
      const { error } = await supabase.from("testimonials").update(payload).eq("id", editing!);
      if (error) { toast.error(error.message); return; }
      toast.success("Testimonial updated");
    }
    cancel(); fetchItems();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    toast.success("Testimonial deleted"); fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Testimonials</h1>
        <Button onClick={startNew} className="rounded-full gap-2"><Plus className="h-4 w-4" /> Add Testimonial</Button>
      </div>

      {editing && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-4">
          <h2 className="font-heading font-semibold">{isNew ? "New Testimonial" : "Edit Testimonial"}</h2>
          <div className="space-y-1"><label className="text-xs font-medium">Quote *</label><Textarea value={form.quote ?? ""} onChange={e => setForm({ ...form, quote: e.target.value })} className="rounded-xl" rows={3} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-medium">Author Name *</label><Input value={form.author_name ?? ""} onChange={e => setForm({ ...form, author_name: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Author Role</label><Input value={form.author_role ?? ""} onChange={e => setForm({ ...form, author_role: e.target.value })} className="rounded-xl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-medium">Sort Order</label><Input type="number" value={form.sort_order ?? 0} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="rounded-xl" /></div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" checked={form.is_published ?? true} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
              <label className="text-sm">Published</label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="rounded-full gap-2"><Check className="h-4 w-4" /> Save</Button>
            <Button variant="ghost" onClick={cancel} className="rounded-full gap-2"><X className="h-4 w-4" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(t => (
          <div key={t.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between shadow-card">
            <div>
              <p className="font-semibold text-sm line-clamp-1">"{t.quote}"</p>
              <p className="text-xs text-muted-foreground">{t.author_name} — {t.author_role}{!t.is_published && " · Draft"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(t)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No testimonials yet.</p>}
      </div>
    </div>
  );
};

export default AdminTestimonials;
