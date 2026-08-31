// Server-side blog reads for SSR. Uses the Supabase REST endpoint with the
// publishable key (same approach as src/lib/seoLoaders.ts) so the blog list and
// individual posts exist in the very first HTML response.

const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const SUPABASE_KEY = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  author: string | null;
  cover_image_url: string | null;
  language: string | null;
  published_at: string | null;
  updated_at: string | null;
  is_published: boolean | null;
  translation_slug?: string | null;
};

const SELECT =
  "id,slug,title,excerpt,content,category,author,cover_image_url,language,published_at,updated_at,is_published,translation_slug";

/** Never let a slow upstream stall the SSR stream. */
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
    ]);
  } catch {
    return fallback;
  }
}

async function restSelect<T>(path: string): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) return [];
  return (await res.json()) as T[];
}

export async function fetchPublishedPosts(language: "sv" | "en"): Promise<BlogPostRow[]> {
  const now = encodeURIComponent(new Date().toISOString());
  return withTimeout(
    restSelect<BlogPostRow>(
      `blog_posts?select=${SELECT}&is_published=eq.true&published_at=lte.${now}&language=eq.${language}&order=published_at.desc`
    ),
    4000,
    []
  );
}

export type SinglePostResult = {
  /** true = confirmed miss (404), false = upstream failure (do not 404). */
  confirmedMiss: boolean;
  post: BlogPostRow | null;
};

export async function fetchPublishedPost(slug: string): Promise<SinglePostResult> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return { confirmedMiss: false, post: null };
  const now = encodeURIComponent(new Date().toISOString());
  try {
    const res = await Promise.race([
      fetch(
        `${SUPABASE_URL}/rest/v1/blog_posts?select=${SELECT}&slug=eq.${encodeURIComponent(
          slug
        )}&is_published=eq.true&published_at=lte.${now}&limit=1`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      ),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000)),
    ]);
    if (!res || !res.ok) return { confirmedMiss: false, post: null };
    const rows = (await res.json()) as BlogPostRow[];
    if (!rows.length) return { confirmedMiss: true, post: null };
    return { confirmedMiss: false, post: rows[0] ?? null };
  } catch {
    return { confirmedMiss: false, post: null };
  }
}
