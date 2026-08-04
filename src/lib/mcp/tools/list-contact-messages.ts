import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_contact_messages",
  title: "List contact messages",
  description: "List customer messages submitted through the contact form (admin access only).",
  inputSchema: {
    unreadOnly: z.boolean().default(false).describe("Only return messages that have not been marked as read."),
    limit: z.number().int().min(1).max(100).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ unreadOnly, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("contact_submissions")
      .select("id,name,email,message,is_read,created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (unreadOnly) query = query.eq("is_read", false);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { messages: data ?? [] },
    };
  },
});