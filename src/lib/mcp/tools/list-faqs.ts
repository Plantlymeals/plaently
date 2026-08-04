import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_faqs",
  title: "List FAQs",
  description: "List FAQ entries (English and Swedish) from the CMS.",
  inputSchema: {
    publishedOnly: z.boolean().default(true).describe("Only return published FAQs."),
    limit: z.number().int().min(1).max(100).default(50),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ publishedOnly, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("faqs")
      .select("id,question,answer,question_sv,answer_sv,is_published,sort_order")
      .order("sort_order", { ascending: true })
      .limit(limit ?? 50);
    if (publishedOnly !== false) query = query.eq("is_published", true);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { faqs: data ?? [] },
    };
  },
});