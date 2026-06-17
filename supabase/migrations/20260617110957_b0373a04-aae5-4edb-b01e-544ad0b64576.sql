-- Stop exposing author_email via direct table SELECT. Public reads must go through
-- public_product_reviews (which omits author_email). Switch the view to
-- security_definer so anon/authenticated do not need underlying-table SELECT.

ALTER VIEW public.public_product_reviews SET (security_invoker = false);

GRANT SELECT ON public.public_product_reviews TO anon, authenticated;

DROP POLICY IF EXISTS "Approved reviews readable via view" ON public.product_reviews;

-- Revoke any direct table SELECT from anon/authenticated to be safe.
REVOKE SELECT ON public.product_reviews FROM anon, authenticated;