import type { Database } from "@/integrations/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type BundleRow = Database["public"]["Tables"]["bundles"]["Row"];

/**
 * Static fallback used only when the database cannot be reached.
 * Mirrors the current published CMS catalog (meal slugs are real Shopify handles).
 */
export const FALLBACK_CATALOG = `PRODUCTS:
- Plant-Based Fusilli Bolognese (slug: plant-based-fusilli-bolognese) — 35 kr per meal · 22g protein · vegan
- Plant-Based Pasta Carbonara (slug: plant-based-pasta-carbonara) — 35 kr per meal · 23g protein · vegetarian (milk protein)
- Plant-Based Yellow Curry & Rice (slug: plant-based-yellow-curry-rice) — 35 kr per meal · 20g protein · vegetarian (milk protein)
- Plant-Based Smoky BBQ Lentils (slug: plant-based-smoky-bbq-lentils) — 35 kr per meal · 21g protein · vegan

BUNDLES:
- Starter Pack — 12 meals · 399 kr total · 33 kr per meal
- Monthly Box — 24 meals · 759 kr total · 32 kr per meal
- Office Pack — 48 meals · 1490 kr total · 31 kr per meal
- Big Office Pack — 96 meals · 2890 kr total · 31 kr per meal`;

/**
 * Builds the live product catalog text from the CMS (published items only).
 * Falls back to the static catalog if the database is unreachable.
 */
export async function buildProductCatalog(): Promise<string> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [productsRes, bundlesRes] = await Promise.all([
      supabaseAdmin
        .from("products")
        .select("name,slug,price,protein,calories,description,allergens,prep_time")
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
      supabaseAdmin
        .from("bundles")
        .select("name,meal_count,price,per_meal_price,description,badge")
        .eq("is_published", true)
        .order("sort_order", { ascending: true }),
    ]);

if (productsRes.error) throw productsRes.error;
    const products: Array<
      Pick<ProductRow, "name" | "slug" | "price" | "protein" | "calories" | "description" | "allergens" | "prep_time">
    > = productsRes.data ?? [];
    if (products.length === 0) return FALLBACK_CATALOG;

    const bundles: Array<
      Pick<BundleRow, "name" | "meal_count" | "price" | "per_meal_price" | "description" | "badge">
    > = bundlesRes.error ? [] : (bundlesRes.data ?? []);
    const lines: string[] = [];

    lines.push("PRODUCTS:");
    for (const p of products) {
      const desc = (p.description ?? "").replace(/\s+/g, " ").trim().slice(0, 220);
      const details = [
        p.price ? `${p.price} per meal` : "",
        p.protein ? `${p.protein} protein` : "",
        p.calories ? `${p.calories} kcal` : "",
        p.prep_time ? `prep: ${p.prep_time}` : "",
        p.allergens ? `allergens: ${p.allergens}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      lines.push(`- ${p.name} (slug: ${p.slug}) — ${details}${desc ? ` — ${desc}` : ""}`);
    }

    lines.push("");
    lines.push("BUNDLES:");
    for (const b of bundles) {
      const details = [
        b.meal_count ? `${b.meal_count} meals` : "",
        b.price ? `${b.price} total` : "",
        b.per_meal_price ? `${b.per_meal_price} per meal` : "",
        b.badge ? `badge: ${b.badge}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      lines.push(
        `- ${b.name} — ${details}${b.description ? ` — ${b.description}` : ""}`,
      );
    }

    return lines.join("\n");
  } catch {
    return FALLBACK_CATALOG;
  }
}

/** Builds the system prompt with live catalog data and compliance rules. */
export function buildAssistantInstructions(catalog: string, lang: string): string {
  const siteLang = lang === "sv" ? "Swedish" : "English";
  return `You are PLÄNTLY AI, the friendly meal assistant for PLÄNTLY (plaently.com), a Swedish brand selling plant-based protein instant meals: real food, ~20g plant protein per serving, ready in about 5 minutes, no protein powders.

CURRENT CATALOG — recommend ONLY products and bundles from this list:
${catalog}

DIETARY RULES — compliance critical, never mislabel:
- Fusilli Bolognese and Smoky BBQ Lentils are VEGAN.
- Pasta Carbonara and Yellow Curry & Rice are VEGETARIAN (they contain milk protein) — never call them vegan.
- All meals are plant-based protein meals and fiber-rich. Never describe the whole range as "vegan".

GUIDELINES:
- The site language is ${siteLang}. If the user writes in another language, answer in that language.
- Recommend concrete products: name the meal and link it as /product/<slug>.
- Suggest bundles (Starter 12, Monthly 24, Office 48, Big Office 96 meals) when the user wants variety, office supply or better value.
- Be concise (max ~150 words), warm and concrete. Use short lines or bullet points when helpful.
- Answer general nutrition questions briefly, but never give medical advice — suggest consulting a doctor or dietitian.
- Do not invent products, prices or links. If unsure, point to /faq or contact hello@plaently.com.
- Direct detailed order, shipping or subscription questions to the FAQ page.`;
}