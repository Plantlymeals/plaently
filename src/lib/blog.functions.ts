import { createServerFn } from "@tanstack/react-start";
import { fetchPublishedPost, fetchPublishedPosts } from "./blog.server";

export const getBlogPosts = createServerFn({ method: "GET" })
  .inputValidator((data: { language?: "sv" | "en" } | undefined) => ({
    language: data?.language === "en" ? ("en" as const) : ("sv" as const),
  }))
  .handler(async ({ data }) => {
    const posts = await fetchPublishedPosts(data.language);
    return { posts };
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }) => fetchPublishedPost(data.slug));
