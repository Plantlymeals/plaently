-- Use security_invoker view (respects RLS)
CREATE OR REPLACE VIEW public.public_product_reviews
WITH (security_invoker = true) AS
SELECT id, product_slug, author_name, rating, title, body, status, created_at, approved_at
FROM public.product_reviews
WHERE status = 'approved';

GRANT SELECT ON public.public_product_reviews TO anon, authenticated;

-- Restore public SELECT policy for approved reviews
DROP POLICY IF EXISTS "Approved reviews readable via view" ON public.product_reviews;
CREATE POLICY "Approved reviews readable via view"
ON public.product_reviews
FOR SELECT
USING (status = 'approved');

-- Column-level: anon and authenticated can read everything EXCEPT author_email
REVOKE SELECT ON public.product_reviews FROM anon, authenticated;
GRANT SELECT (id, product_slug, author_name, rating, title, body, status, created_at, approved_at, updated_at)
  ON public.product_reviews TO anon, authenticated;