
-- 1. Stop exposing author_email via the underlying table.
DROP POLICY IF EXISTS "Approved reviews readable" ON public.product_reviews;
REVOKE SELECT ON public.product_reviews FROM anon, authenticated;

-- Ensure the public view exists and is the only public read path.
DROP VIEW IF EXISTS public.public_product_reviews;
CREATE VIEW public.public_product_reviews
WITH (security_invoker = true) AS
SELECT id, product_slug, author_name, rating, title, body, created_at
FROM public.product_reviews
WHERE status = 'approved';
GRANT SELECT ON public.public_product_reviews TO anon, authenticated;

-- The view's security_invoker uses caller's RLS, so re-allow read of approved rows
-- ONLY through the view by adding a column-scoped policy that excludes author_email
-- via the view's projection (the view itself omits the column).
CREATE POLICY "Approved reviews readable via view"
ON public.product_reviews
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- But we don't want direct table SELECT to leak email. Restrict column-level grants:
REVOKE SELECT ON public.product_reviews FROM anon, authenticated;
GRANT SELECT (id, product_slug, author_name, rating, title, body, status, created_at, updated_at, approved_at)
  ON public.product_reviews TO anon, authenticated;

-- 2. Tighten contact_submissions insert checks.
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 100
  AND length(btrim(email)) BETWEEN 3 AND 255
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(message)) BETWEEN 5 AND 5000
);
