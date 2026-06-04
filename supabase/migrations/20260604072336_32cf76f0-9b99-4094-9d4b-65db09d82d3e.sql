-- 1. Restrict public table reads (remove email exposure)
DROP POLICY IF EXISTS "Approved reviews are publicly readable" ON public.product_reviews;

-- 2. Public-safe view excluding author_email
CREATE OR REPLACE VIEW public.public_product_reviews
WITH (security_invoker = true) AS
SELECT id, product_slug, author_name, rating, title, body, status, created_at, approved_at
FROM public.product_reviews
WHERE status = 'approved';

-- Re-add a SELECT policy so the view (running as invoker) can read approved rows
CREATE POLICY "Approved reviews readable via view"
ON public.product_reviews
FOR SELECT
USING (status = 'approved');

GRANT SELECT ON public.public_product_reviews TO anon, authenticated;

-- 3. Validate product_slug references a real product on insert/update
CREATE OR REPLACE FUNCTION public.validate_review_product_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE slug = NEW.product_slug) THEN
    RAISE EXCEPTION 'product_slug % does not reference an existing product', NEW.product_slug;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_review_product_slug_trg ON public.product_reviews;
CREATE TRIGGER validate_review_product_slug_trg
BEFORE INSERT OR UPDATE OF product_slug ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.validate_review_product_slug();