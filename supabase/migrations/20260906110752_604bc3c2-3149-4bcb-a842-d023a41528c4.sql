-- 1) Reviewer emails: stop direct public SELECT on product_reviews; serve public reads only via the view
ALTER VIEW public.public_product_reviews SET (security_invoker = false);
GRANT SELECT ON public.public_product_reviews TO anon, authenticated;
DROP POLICY IF EXISTS "Public can read approved reviews (no email)" ON public.product_reviews;

-- 2) Hero content: add publish flag and restrict public reads to published rows
ALTER TABLE public.hero_content ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
DROP POLICY IF EXISTS "Hero content is publicly readable" ON public.hero_content;
CREATE POLICY "Published hero content is publicly readable"
ON public.hero_content FOR SELECT
TO anon, authenticated
USING (is_published);
