
-- Re-allow anon/authenticated to read approved reviews through the
-- security_invoker public_product_reviews view. Column grants keep
-- author_email hidden.
CREATE POLICY "Public can read approved reviews"
  ON public.product_reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved'::review_status);

GRANT SELECT (id, product_slug, author_name, rating, title, body, status, created_at, approved_at)
  ON public.product_reviews TO anon, authenticated;

GRANT SELECT ON public.public_product_reviews TO anon, authenticated;
