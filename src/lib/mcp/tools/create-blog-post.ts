import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_blog_post",
  title: "Create blog post",
  description: "Create a new blog post in the CMS. Created as a draft unless publish is set to true.",
  inputSchema: {
    title: z.string().trim().min(1),
    slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens."),
    content: z.string().trim().min(1).describe("Post body (HTML or markdown)."),
    excerpt: z.string().trim().optional(),
    category: z.string().trim().optional(),
    language: z.enum(["sv", "en"]).default("sv"),
    publish: z.boolean().default(false).describe("Publish immediately instead of saving as a draft."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, slug, content, excerpt, category, language, publish }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title,
        slug,
        content,
        excerpt: excerpt ?? null,
        category: category ?? null,
        language: language ?? "sv",
        is_published: publish ?? false,
        published_at: publish ? new Date().toISOString() : null,
      })
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { post: data },
    };
  },
});