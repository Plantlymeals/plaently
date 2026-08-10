import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { notifySitemapChanged } from "@/lib/searchConsole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check, GripVertical } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type FAQ = Tables<"faqs">;

const AdminFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [isNew, setIsNew] = useState(false);

  const fetchFaqs = async () => {
    const { data } = await supabase.from("faqs").select("*").order("sort_order");
    if (data) setFaqs(data);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const startNew = () => { setEditing("new"); setIsNew(true); setForm({ question: "", answer: "", sort_order: faqs.length + 1, is_published: true }); };
  const startEdit = (f: FAQ) => { setEditing(f.id); setForm({ ...f }); setIsNew(false); };
  const cancel = () => { setEditing(null); setForm({}); setIsNew(false); };

  const save = async () => {
    if (!form.question?.trim() || !form.answer?.trim()) { toast.error("Question and answer are required"); return; }
    const payload = { question: form.question, answer: form.answer, sort_order: form.sort_order ?? 0, is_published: form.is_published };
    if (isNew) {
      const { error } = await supabase.from("faqs").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("FAQ created");
    } else {
      const { error } = await supabase.from("faqs").update(payload).eq("id", editing!);
      if (error) { toast.error(error.message); return; }
      toast.success("FAQ updated");
    }
    notifySitemapChanged();
    cancel(); fetchFaqs();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    toast.success("FAQ deleted"); notifySitemapChanged(); fetchFaqs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">FAQs</h1>
        <Button onClick={startNew} className="rounded-full gap-2"><Plus className="h-4 w-4" /> Add FAQ</Button>
      </div>

      {editing && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-4">
          <h2 className="font-heading font-semibold">{isNew ? "New FAQ" : "Edit FAQ"}</h2>
          <div className="space-y-1"><label className="text-xs font-medium">Question *</label><Input value={form.question ?? ""} onChange={e => setForm({ ...form, question: e.target.value })} className="rounded-xl" /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Answer *</label><Textarea value={form.answer ?? ""} onChange={e => setForm({ ...form, answer: e.target.value })} className="rounded-xl" rows={3} /></div>
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
        {faqs.map(f => (
          <div key={f.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between shadow-card">
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-semibold text-sm">{f.question}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{f.answer}{!f.is_published && " · Draft"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(f)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No FAQs yet.</p>}
      </div>
    </div>
  );
};

export default AdminFAQs;
