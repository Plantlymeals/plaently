-- Restore invoker view, and use column-level grants so author_email is unreachable publicly
ALTER VIEW public.public_product_reviews SET (security_invoker = true);

CREATE POLICY "Public can read approved reviews (no email)"
ON public.product_reviews FOR SELECT
TO anon, authenticated
USING (status = 'approved'::review_status);

REVOKE SELECT ON public.product_reviews FROM anon, authenticated;
GRANT SELECT (id, product_slug, author_name, rating, title, body, status, created_at, updated_at, approved_at)
  ON public.product_reviews TO anon, authenticated;
