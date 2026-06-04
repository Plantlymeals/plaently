-- Switch view to security definer (default) so it bypasses table RLS for anon
DROP POLICY IF EXISTS "Approved reviews readable via view" ON public.product_reviews;

CREATE OR REPLACE VIEW public.public_product_reviews AS
SELECT id, product_slug, author_name, rating, title, body, status, created_at, approved_at
FROM public.product_reviews
WHERE status = 'approved';

GRANT SELECT ON public.public_product_reviews TO anon, authenticated;

-- Revoke direct table SELECT from anon to prevent email leakage
REVOKE SELECT ON public.product_reviews FROM anon;