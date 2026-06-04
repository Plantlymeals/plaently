
-- Restrict base-table SELECT to admins only; public reads go through the safe view
DROP POLICY IF EXISTS "Approved reviews readable via view" ON public.product_reviews;

-- Recreate view as SECURITY DEFINER so it can read approved rows while base table is admin-only
DROP VIEW IF EXISTS public.public_product_reviews;
CREATE VIEW public.public_product_reviews
WITH (security_invoker = false)
AS
SELECT id, product_slug, author_name, rating, title, body, status, created_at, approved_at, updated_at
FROM public.product_reviews
WHERE status = 'approved'::review_status;

GRANT SELECT ON public.public_product_reviews TO anon, authenticated;
