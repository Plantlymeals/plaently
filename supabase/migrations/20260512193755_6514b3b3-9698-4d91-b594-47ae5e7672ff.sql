ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en';
UPDATE public.blog_posts SET language = CASE WHEN slug LIKE '%-sv' THEN 'sv' ELSE 'en' END;
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON public.blog_posts(language);