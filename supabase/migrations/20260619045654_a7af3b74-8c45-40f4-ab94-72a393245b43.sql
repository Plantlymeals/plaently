DROP POLICY IF EXISTS "Public can read approved reviews" ON public.product_reviews;
REVOKE SELECT ON public.product_reviews FROM anon, authenticated;