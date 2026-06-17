-- Revert to security_invoker view (recommended pattern) and use column-level GRANTs
-- to block author_email from anon/authenticated entirely.

ALTER VIEW public.public_product_reviews SET (security_invoker = true);

-- Re-add a row-level policy that allows reading only approved reviews from the base table.
-- Column-level GRANTs (below) prevent author_email from being selected by anon/authenticated.
CREATE POLICY "Public can read approved reviews"
  ON public.product_reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved'::review_status);

-- Grant SELECT only on non-sensitive columns. Notably exclude author_email.
GRANT SELECT (id, product_slug, author_name, rating, title, body, status, created_at, approved_at)
  ON public.product_reviews TO anon, authenticated;

-- Keep the view accessible.
GRANT SELECT ON public.public_product_reviews TO anon, authenticated;