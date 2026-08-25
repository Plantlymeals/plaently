import { supabase } from "@/integrations/supabase/client";

export type BundleRow = {
  id: string;
  name: string;
  is_mixable: boolean;
  components: Array<{ name: string; quantity: number }>;
  meal_count: number;
  price: string | null;
  per_meal_price: string | null;
  badge: string | null;
  description: string | null;
  sort_order: number | null;
  is_published: boolean | null;
  shopify_product_id: string | null;
  image_url: string | null;
};

// Workaround: the supabase-js client's request promise can hang inside the
// Lovable preview iframe (auth init never resolves under third-party cookie
// restrictions). Use a direct REST call for this public-read query.
export async function fetchPublishedBundles(): Promise<BundleRow[]> {
  try {
    const url = `${import.meta.env['VITE_SUPABASE_URL']}/rest/v1/bundles?select=id,name,is_mixable,components,meal_count,price,per_meal_price,badge,description,sort_order,is_published,shopify_product_id,image_url&is_published=eq.true&order=sort_order.asc`;
    const key = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string;
    const res = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as BundleRow[]) : [];
  } catch {
    // Fallback to supabase-js if env vars are missing (e.g. during SSR/tests).
    try {
      const { data } = await supabase
        .from("bundles")
        .select("id,name,is_mixable,components,meal_count,price,per_meal_price,badge,description,sort_order,is_published,shopify_product_id,image_url")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      return (data as any) ?? [];
    } catch {
      return [];
    }
  }
}