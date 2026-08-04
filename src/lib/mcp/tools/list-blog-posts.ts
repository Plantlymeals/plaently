import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description: "List blog posts from the CMS, optionally filtered by language, category or publish state.",
  inputSchema: {
    language: z.enum(["sv", "en"]).optional().describe("Filter by post language."),
    category: z.string().trim().min(1).optional().describe("Filter by category slug."),
    published: z.boolean().optional().describe("Filter by publish state."),
    limit: z.number().int().min(1).max(100).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ language, category, published, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("blog_posts")
      .select("id,title,slug,excerpt,category,language,is_published,published_at,updated_at")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit ?? 20);
    if (language) query = query.eq("language", language);
    if (category) query = query.eq("category", category);
    if (typeof published === "boolean") query = query.eq("is_published", published);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { posts: data ?? [] },
    };
  },
});