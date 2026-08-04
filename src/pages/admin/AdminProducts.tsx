import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { translateProductHtml } from "@/lib/productDescription";
import ImageUpload from "@/components/admin/ImageUpload";
import { submitSitemapToGoogle } from "@/lib/searchConsole";

type Product = Tables<"products">;

const emptyProduct: Partial<TablesInsert<"products">> = {
  slug: "", sku: "", name: "", description: "", protein: "", calories: "", prep_time: "5 min",
  price: "", ingredients: "", allergens: "", image_url: "", is_published: true, sort_order: 0,
  nutrition: { protein: "", carbs: "", fat: "", saturated_fat: "", fiber: "", sugar: "", salt: "" },
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [isNew, setIsNew] = useState(false);
  const [previewInput, setPreviewInput] = useState<string>(
    "Creamy coconut milk with curry, coriander and lime — a trip to Southeast Asian street food. Protein-based rice with vegan yellow curry sauce."
  );

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
    const name = (form.name ?? "").trim();
    const slug = (form.slug ?? "").trim();
    const sku = (form.sku ?? "").trim();
    if (!name) { toast.error("Name is required"); return; }
    if (!slug) { toast.error("Slug is required"); return; }
    if (!sku) { toast.error("SKU / article number is required"); return; }

    // Uniqueness check against other products (exclude self when editing)
    const dupSlug = products.find(p => p.slug.trim().toLowerCase() === slug.toLowerCase() && (isNew || p.id !== editing));
    if (dupSlug) { toast.error(`Slug "${slug}" is already used by "${dupSlug.name}"`); return; }
    const dupSku = products.find(p => (p.sku ?? "").trim().toLowerCase() === sku.toLowerCase() && (isNew || p.id !== editing));
    if (dupSku) { toast.error(`SKU "${sku}" is already used by "${dupSku.name}"`); return; }

    const payload = {
      slug, sku, name, description: form.description,
      protein: form.protein, calories: form.calories, prep_time: form.prep_time,
      price: form.price, ingredients: form.ingredients, allergens: form.allergens,
      nutrition: form.nutrition, image_url: form.image_url,
      is_published: form.is_published, sort_order: form.sort_order ?? 0,
    };

    if (isNew) {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        if (error.code === "23505") toast.error("Slug or SKU already exists in the database");
        else toast.error(error.message);
        return;
      }
      toast.success("Product created");
    } else {
      const { error } = await supabase.from("products").update(payload).eq("id", editing!);
      if (error) {
        if (error.code === "23505") toast.error("Slug or SKU already exists in the database");
        else toast.error(error.message);
        return;
      }
      toast.success("Product updated");
    }
    // Newly published content: nudge Google to re-crawl the sitemap.
    if (form.is_published) void submitSitemapToGoogle({ silent: true });
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
            <div className="space-y-1"><label className="text-xs font-medium">SKU / Article # *</label><Input value={form.sku ?? ""} onChange={e => setForm({ ...form, sku: e.target.value })} className="rounded-xl" placeholder="e.g. 1001" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Price</label><Input value={form.price ?? ""} onChange={e => setForm({ ...form, price: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Protein</label><Input value={form.protein ?? ""} onChange={e => setForm({ ...form, protein: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Calories</label><Input value={form.calories ?? ""} onChange={e => setForm({ ...form, calories: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Prep Time</label><Input value={form.prep_time ?? ""} onChange={e => setForm({ ...form, prep_time: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Sort Order</label><Input type="number" value={form.sort_order ?? 0} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="rounded-xl" /></div>
          </div>
          <ImageUpload
            label="Product image (overrides default cup image)"
            value={form.image_url ?? ""}
            onChange={(url) => setForm({ ...form, image_url: url ?? "" })}
          />
          <div className="space-y-1"><label className="text-xs font-medium">Description</label><Textarea value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-xl" rows={2} /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Ingredients</label><Textarea value={form.ingredients ?? ""} onChange={e => setForm({ ...form, ingredients: e.target.value })} className="rounded-xl" rows={2} /></div>
          <div className="space-y-1"><label className="text-xs font-medium">Allergens</label><Input value={form.allergens ?? ""} onChange={e => setForm({ ...form, allergens: e.target.value })} className="rounded-xl" /></div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Nutrition (per serving)</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[
                { key: "protein", label: "Protein" },
                { key: "carbs", label: "Carbs" },
                { key: "sugars", label: "↳ of which sugars" },
                { key: "fat", label: "Fat" },
                { key: "saturated_fat", label: "↳ of which saturated" },
                { key: "fiber", label: "Fiber" },
                { key: "salt", label: "Salt" },
              ].map(({ key: k, label }) => (
                <div key={k} className="space-y-1">
                  <label className="text-[10px] text-muted-foreground">{label}</label>
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
              <p className="text-xs text-muted-foreground">{p.slug} · SKU {p.sku ?? "—"} · {p.price} · {p.protein} protein{!p.is_published && " · Draft"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No products yet.</p>}
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-4">
        <div>
          <h2 className="font-heading font-semibold">Description Translation Preview</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Paste any English (or mixed) product copy / HTML below to see exactly how it will render in Swedish on the live site, using the current translation rules. Useful for verifying changes like Yellow Curry before publishing.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Source (EN or HTML)</label>
            <Textarea
              value={previewInput}
              onChange={e => setPreviewInput(e.target.value)}
              className="rounded-xl font-mono text-xs min-h-[220px]"
              rows={10}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Swedish preview (live)</label>
            <div
              className="rounded-xl border border-border/50 bg-background p-4 min-h-[220px] text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translateProductHtml(previewInput, "sv")) }}
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">English preview (as-is)</label>
            <div
              className="rounded-xl border border-border/50 bg-background p-4 min-h-[80px] text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translateProductHtml(previewInput, "en")) }}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Quick samples</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Yellow Curry", text: "Creamy coconut milk with curry, coriander and lime — a trip to Southeast Asian street food. Protein-based rice with vegan yellow curry sauce." },
                { label: "Smoky BBQ", text: "Smoky BBQ with smoked paprika, caramelised onion and garlic — rich lentil texture, maximum satiety. Protein-based green lentils with vegan smoky BBQ sauce." },
                { label: "Bolognese", text: "A sun-soaked flavour experience with rich, spicy bolognese sauce. Protein-based fusilli with vegan bolognese sauce." },
                { label: "Carbonara", text: "Creamy, peppery carbonara in classic Italian style — with a clever play of textures. Protein-based fusilli with vegan carbonara sauce." },
              ].map(s => (
                <Button key={s.label} type="button" variant="outline" size="sm" className="rounded-full text-xs" onClick={() => setPreviewInput(s.text)}>
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
