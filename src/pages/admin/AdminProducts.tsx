import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const emptyProduct: Partial<TablesInsert<"products">> = {
  slug: "", name: "", description: "", protein: "", calories: "", prep_time: "5 min",
  price: "", ingredients: "", allergens: "", image_url: "", is_published: true, sort_order: 0,
  nutrition: { protein: "", carbs: "", fat: "", fiber: "", sugar: "", salt: "" },
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [isNew, setIsNew] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("products").select("*").order("sort_order");
    if (data) setProducts(data);
  };

  useEffect(() => { fetch(); }, []);

  const startEdit = (p: Product) => {
    setEditing(p.id);
    setForm({ ...p });
    setIsNew(false);
  };

  const startNew = () => {
    setEditing("new");
    setForm({ ...emptyProduct });
    setIsNew(true);
  };

  const cancel = () => { setEditing(null); setForm({}); setIsNew(false); };

  const save = async () => {
    if (!form.name?.trim() || !form.slug?.trim()) {
      toast.error("Name and slug are required");
      return;
    }
    const payload = {
      slug: form.slug, name: form.name, description: form.description,
      protein: form.protein, calories: form.calories, prep_time: form.prep_time,
      price: form.price, ingredients: form.ingredients, allergens: form.allergens,
      nutrition: form.nutrition, image_url: form.image_url,
      is_published: form.is_published, sort_order: form.sort_order ?? 0,
    };

    if (isNew) {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Product created");
    } else {
      const { error } = await supabase.from("products").update(payload).eq("id", editing!);
      if (error) { toast.error(error.message); return; }
      toast.success("Product updated");
    }
    cancel();
    fetch();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast.success("Product deleted");
    fetch();
  };

  const updateNutrition = (key: string, val: string) => {
    setForm({ ...form, nutrition: { ...(form.nutrition as Record<string, string>), [key]: val } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Products</h1>
        <Button onClick={startNew} className="rounded-full gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      {editing && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-4">
          <h2 className="font-heading font-semibold">{isNew ? "New Product" : "Edit Product"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-medium">Name *</label><Input value={form.name ?? ""} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Slug *</label><Input value={form.slug ?? ""} onChange={e => setForm({ ...form, slug: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Price</label><Input value={form.price ?? ""} onChange={e => setForm({ ...form, price: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Protein</label><Input value={form.protein ?? ""} onChange={e => setForm({ ...form, protein: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Calories</label><Input value={form.calories ?? ""} onChange={e => setForm({ ...form, calories: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Prep Time</label><Input value={form.prep_time ?? ""} onChange={e => setForm({ ...form, prep_time: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Image URL</label><Input value={form.image_url ?? ""} onChange={e => setForm({ ...form, image_url: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Sort Order</label><Input type="number" value={form.sort_order ?? 0} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="rounded-xl" /></div>
          </div>
          <div className="space-y-1"><label className="text-xs font-medium">Description</label><Textarea value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-xl" rows={2} /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Ingredients</label><Textarea value={form.ingredients ?? ""} onChange={e => setForm({ ...form, ingredients: e.target.value })} className="rounded-xl" rows={2} /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Allergens</label><Input value={form.allergens ?? ""} onChange={e => setForm({ ...form, allergens: e.target.value })} className="rounded-xl" /></div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Nutrition (per serving)</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {["protein", "carbs", "fat", "fiber", "sugar", "salt"].map(k => (
                <div key={k} className="space-y-1">
                  <label className="text-[10px] text-muted-foreground capitalize">{k}</label>
                  <Input value={(form.nutrition as Record<string, string>)?.[k] ?? ""} onChange={e => updateNutrition(k, e.target.value)} className="rounded-xl text-xs" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_published ?? true} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
            <label className="text-sm">Published</label>
          </div>

          <div className="flex gap-2">
            <Button onClick={save} className="rounded-full gap-2"><Check className="h-4 w-4" /> Save</Button>
            <Button variant="ghost" onClick={cancel} className="rounded-full gap-2"><X className="h-4 w-4" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between shadow-card">
            <div>
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.slug} · {p.price} · {p.protein} protein{!p.is_published && " · Draft"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No products yet.</p>}
      </div>
    </div>
  );
};

export default AdminProducts;
