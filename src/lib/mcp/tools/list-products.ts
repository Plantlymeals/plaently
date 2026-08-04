import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List PLÄNTLY products from the CMS with name, slug, price, protein and publish state.",
  inputSchema: {
    search: z.string().trim().min(1).optional().describe("Optional case-insensitive name filter."),
    limit: z.number().int().min(1).max(100).default(25).describe("Maximum number of products to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("products")
      .select("id,name,slug,price,protein,calories,sku,is_published,sort_order")
      .order("sort_order", { ascending: true })
      .limit(limit ?? 25);
    if (search) query = query.ilike("name", `%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { products: data ?? [] },
    };
  },
});