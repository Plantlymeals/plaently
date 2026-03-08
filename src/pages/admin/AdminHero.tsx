import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, X, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type HeroContent = Tables<"hero_content">;

const AdminHero = () => {
  const [items, setItems] = useState<HeroContent[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const fetchItems = async () => {
    const { data } = await supabase.from("hero_content").select("*").order("section_key");
    if (data) setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const startEdit = (h: HeroContent) => { setEditing(h.id); setForm({ ...h }); };
  const cancel = () => { setEditing(null); setForm({}); };

  const save = async () => {
    const payload = { headline: form.headline, subheadline: form.subheadline, cta_text: form.cta_text, cta_link: form.cta_link, image_url: form.image_url };
    const { error } = await supabase.from("hero_content").update(payload).eq("id", editing!);
    if (error) { toast.error(error.message); return; }
    toast.success("Hero content updated");
    cancel(); fetchItems();
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Hero Content</h1>

      {editing && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-4">
          <h2 className="font-heading font-semibold">Edit: {form.section_key}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-medium">Headline</label><Input value={form.headline ?? ""} onChange={e => setForm({ ...form, headline: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Subheadline</label><Input value={form.subheadline ?? ""} onChange={e => setForm({ ...form, subheadline: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">CTA Text</label><Input value={form.cta_text ?? ""} onChange={e => setForm({ ...form, cta_text: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">CTA Link</label><Input value={form.cta_link ?? ""} onChange={e => setForm({ ...form, cta_link: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1 sm:col-span-2"><label className="text-xs font-medium">Image URL</label><Input value={form.image_url ?? ""} onChange={e => setForm({ ...form, image_url: e.target.value })} className="rounded-xl" /></div>
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="rounded-full gap-2"><Check className="h-4 w-4" /> Save</Button>
            <Button variant="ghost" onClick={cancel} className="rounded-full gap-2"><X className="h-4 w-4" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(h => (
          <div key={h.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between shadow-card">
            <div>
              <p className="font-semibold text-sm">{h.section_key}</p>
              <p className="text-xs text-muted-foreground">{h.headline}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => startEdit(h)}><Pencil className="h-4 w-4" /></Button>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No hero content yet.</p>}
      </div>
    </div>
  );
};

export default AdminHero;
