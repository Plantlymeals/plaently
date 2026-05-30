
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS translation_slug text;

-- Auto-pair posts that follow the `${en-slug}-sv` convention
UPDATE public.blog_posts sv
SET translation_slug = en.slug
FROM public.blog_posts en
WHERE sv.language = 'sv'
  AND sv.slug LIKE '%-sv'
  AND en.language = 'en'
  AND en.slug = left(sv.slug, length(sv.slug) - 3)
  AND sv.translation_slug IS DISTINCT FROM en.slug;

UPDATE public.blog_posts en
SET translation_slug = sv.slug
FROM public.blog_posts sv
WHERE en.language = 'en'
  AND sv.language = 'sv'
  AND sv.slug = en.slug || '-sv'
  AND en.translation_slug IS DISTINCT FROM sv.slug;

-- Manual pair for the non-conforming meal cups article
UPDATE public.blog_posts SET translation_slug = 'darfor-slar-maltidskoppar-pulver-och-shakes'
  WHERE slug = 'why-meal-cups-beat-powders-and-shakes';
UPDATE public.blog_posts SET translation_slug = 'why-meal-cups-beat-powders-and-shakes'
  WHERE slug = 'darfor-slar-maltidskoppar-pulver-och-shakes';
