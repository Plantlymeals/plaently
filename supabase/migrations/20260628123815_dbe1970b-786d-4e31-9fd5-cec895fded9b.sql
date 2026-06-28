DROP POLICY IF EXISTS "Public can read approved reviews" ON public.product_reviews;
REVOKE SELECT ON public.product_reviews FROM anon, authenticated;
GRANT SELECT (id, product_slug, author_name, rating, title, body, created_at, status, approved_at) ON public.product_reviews TO anon, authenticated;
CREATE POLICY "Public can read approved reviews (no email)" ON public.product_reviews FOR SELECT TO anon, authenticated USING (status = 'approved'::review_status);