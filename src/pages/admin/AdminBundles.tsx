import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { notifySitemapChanged } from "@/lib/searchConsole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";
import ImageUpload from "@/components/admin/ImageUpload";

type Bundle = Tables<"bundles">;
type Component = { name: string; quantity: number };

const toComponents = (val: unknown): Component[] => {
  if (!Array.isArray(val)) return [];
  return val
    .map((c: any) => ({ name: String(c?.name ?? ""), quantity: Number(c?.quantity) || 0 }))
    .filter((c) => c.name.trim().length > 0);
};

const AdminBundles = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [isNew, setIsNew] = useState(false);
  const [shopifyBundles, setShopifyBundles] = useState<ShopifyProduct[]>([]);

  const fetchBundles = async () => {
    const { data } = await supabase.from("bundles").select("*").order("sort_order");
    if (data) setBundles(data);
  };

  useEffect(() => {
    fetchBundles();
    fetchShopifyProducts(50, "product_type:Bundle").then((data) => {
      if (data) setShopifyBundles(data);
    });
  }, []);

  const startNew = () => { setEditing("new"); setIsNew(true); setForm({ name: "", meal_count: 12, price: "", per_meal_price: "", badge: "", description: "", sort_order: bundles.length + 1, is_published: true, is_mixable: false, components: [], shopify_product_id: "", image_url: "" }); };
  const startEdit = (b: Bundle) => { setEditing(b.id); setForm({ ...b, components: toComponents(b.components) }); setIsNew(false); };
  const cancel = () => { setEditing(null); setForm({}); setIsNew(false); };

  const save = async () => {
    if (!form.name?.trim()) { toast.error("Name is required"); return; }
    const cleanedComponents = toComponents(form.components);
    const payload = {
      name: form.name,
      meal_count: form.meal_count,
      price: form.price,
      per_meal_price: form.per_meal_price,
      badge: form.badge || null,
      description: form.description,
      sort_order: form.sort_order ?? 0,
      is_published: form.is_published,
      is_mixable: form.is_mixable ?? false,
      components: cleanedComponents,
      shopify_product_id: form.shopify_product_id?.trim() || null,
      image_url: form.image_url?.trim() ? form.image_url : null,
    };
    if (isNew) {
      const { error } = await supabase.from("bundles").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Bundle created");
    } else {
      const { error } = await supabase.from("bundles").update(payload).eq("id", editing!);
      if (error) { toast.error(error.message); return; }
      toast.success("Bundle updated");
    }
    notifySitemapChanged();
    cancel(); fetchBundles();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this bundle?")) return;
    await supabase.from("bundles").delete().eq("id", id);
    toast.success("Bundle deleted"); notifySitemapChanged(); fetchBundles();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Bundles</h1>
        <Button onClick={startNew} className="rounded-full gap-2"><Plus className="h-4 w-4" /> Add Bundle</Button>
      </div>

      {editing && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card space-y-4">
          <h2 className="font-heading font-semibold">{isNew ? "New Bundle" : "Edit Bundle"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-xs font-medium">Name *</label><Input value={form.name ?? ""} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Meal Count</label><Input type="number" value={form.meal_count ?? 12} onChange={e => setForm({ ...form, meal_count: parseInt(e.target.value) || 0 })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Price</label><Input value={form.price ?? ""} onChange={e => setForm({ ...form, price: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Per Meal Price</label><Input value={form.per_meal_price ?? ""} onChange={e => setForm({ ...form, per_meal_price: e.target.value })} className="rounded-xl" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Badge</label><Input value={form.badge ?? ""} onChange={e => setForm({ ...form, badge: e.target.value })} className="rounded-xl" placeholder="e.g. Most Popular" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Sort Order</label><Input type="number" value={form.sort_order ?? 0} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="rounded-xl" /></div>
          </div>
          <div className="space-y-1"><label className="text-xs font-medium">Description</label><Textarea value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-xl" rows={2} /></div>
          <ImageUpload
            label="Bundle image (shown on cards)"
            value={form.image_url ?? ""}
            onChange={(url) => setForm({ ...form, image_url: url ?? "" })}
          />
          <div className="space-y-1">
            <label className="text-xs font-medium">Shopify product (required to be buyable)</label>
            <select
              value={form.shopify_product_id ?? ""}
              onChange={(e) => setForm({ ...form, shopify_product_id: e.target.value })}
              className="w-full rounded-xl border border-input bg-background h-10 px-3 text-sm"
            >
              <option value="">— Not linked (Coming soon) —</option>
              {shopifyBundles.map((p) => (
                <option key={p.node.id} value={p.node.id}>
                  {p.node.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-muted-foreground">
              Pick which Shopify product is sold when customers click "Order now".
              Bundles without a link still appear on the site but show "Coming soon".
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_published ?? true} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
            <label className="text-sm">Published</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_mixable ?? false} onChange={e => setForm({ ...form, is_mixable: e.target.checked })} />
            <label className="text-sm">Allow customers to mix &amp; match contents</label>
          </div>
          <div className="space-y-2 border-t border-border/50 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Bundle contents</label>
                <p className="text-xs text-muted-foreground">Shown on the customer card so they know what's inside. Used when mixing is disabled.</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full gap-1"
                onClick={() => setForm({ ...form, components: [...toComponents(form.components), { name: "", quantity: 1 }] })}
              >
                <Plus className="h-3.5 w-3.5" /> Add item
              </Button>
            </div>
            {(toComponents(form.components).length === 0 && !(Array.isArray(form.components) && form.components.length > 0)) && (
              <p className="text-xs text-muted-foreground italic">No items yet.</p>
            )}
            {(Array.isArray(form.components) ? form.components : []).map((c: any, idx: number) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  value={c?.name ?? ""}
                  placeholder="Item name (e.g. Curry)"
                  onChange={e => {
                    const next = [...(form.components as any[])];
                    next[idx] = { ...next[idx], name: e.target.value };
                    setForm({ ...form, components: next });
                  }}
                  className="rounded-xl flex-1"
                />
                <Input
                  type="number"
                  min={1}
                  value={c?.quantity ?? 1}
                  onChange={e => {
                    const next = [...(form.components as any[])];
                    next[idx] = { ...next[idx], quantity: parseInt(e.target.value) || 0 };
                    setForm({ ...form, components: next });
                  }}
                  className="rounded-xl w-24"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const next = (form.components as any[]).filter((_, i) => i !== idx);
                    setForm({ ...form, components: next });
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={save} className="rounded-full gap-2"><Check className="h-4 w-4" /> Save</Button>
            <Button variant="ghost" onClick={cancel} className="rounded-full gap-2"><X className="h-4 w-4" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {bundles.map(b => (
          <div key={b.id} className="bg-card rounded-xl border border-border/50 p-4 flex items-center justify-between shadow-card">
            <div>
              <p className="font-semibold text-sm">{b.name} {b.badge && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">{b.badge}</span>}</p>
              <p className="text-xs text-muted-foreground">
                {b.meal_count} meals · {b.price}
                {!b.is_published && " · Draft"}
                {!b.shopify_product_id && " · ⚠ Not linked to Shopify"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => startEdit(b)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => remove(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {bundles.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No bundles yet.</p>}
      </div>
    </div>
  );
};

export default AdminBundles;
