
-- Switch view back to security_invoker to avoid security-definer view warning
DROP VIEW IF EXISTS public.public_product_reviews;
CREATE VIEW public.public_product_reviews
WITH (security_invoker = true)
AS
SELECT id, product_slug, author_name, rating, title, body, status, created_at, approved_at, updated_at
FROM public.product_reviews
WHERE status = 'approved'::review_status;
GRANT SELECT ON public.public_product_reviews TO anon, authenticated;

-- Restore public read policy on base table for approved reviews
CREATE POLICY "Approved reviews readable"
ON public.product_reviews
FOR SELECT
TO anon, authenticated
USING (status = 'approved'::review_status);

-- Block public access to the email column at the column level
REVOKE SELECT ON public.product_reviews FROM anon, authenticated;
GRANT SELECT (id, product_slug, author_name, rating, title, body, status, created_at, approved_at, updated_at)
  ON public.product_reviews TO anon, authenticated;
GRANT INSERT ON public.product_reviews TO anon, authenticated;
