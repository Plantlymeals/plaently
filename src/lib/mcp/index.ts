import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import listBlogPostsTool from "./tools/list-blog-posts";
import getBlogPostTool from "./tools/get-blog-post";
import createBlogPostTool from "./tools/create-blog-post";
import listFaqsTool from "./tools/list-faqs";
import listContactMessagesTool from "./tools/list-contact-messages";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "plaently-protein-fast-food",
  title: "Pläntly Protein Fast Food",
  version: "0.1.0",
  instructions:
    "Tools for the PLÄNTLY plant-based protein meals site. Read products, FAQs and blog posts from the CMS, draft or publish new blog posts, and review customer contact messages. All tools act as the signed-in PLÄNTLY user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listProductsTool,
    listFaqsTool,
    listBlogPostsTool,
    getBlogPostTool,
    createBlogPostTool,
    listContactMessagesTool,
  ],
});