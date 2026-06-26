
UPDATE public.products SET slug = 'plant-based-fusilli-bolognese' WHERE slug = 'fusilli-bolognese';
UPDATE public.products SET slug = 'plant-based-pasta-carbonara' WHERE slug = 'pasta-carbonara';
UPDATE public.products SET slug = 'plant-based-yellow-curry-rice' WHERE slug = 'yellow-curry-rice';
UPDATE public.products SET slug = 'plant-based-smoky-bbq-lentils' WHERE slug = 'smoky-bbq-lentils';

UPDATE public.product_reviews SET product_slug = 'plant-based-fusilli-bolognese' WHERE product_slug = 'fusilli-bolognese';
UPDATE public.product_reviews SET product_slug = 'plant-based-pasta-carbonara' WHERE product_slug = 'pasta-carbonara';
UPDATE public.product_reviews SET product_slug = 'plant-based-yellow-curry-rice' WHERE product_slug = 'yellow-curry-rice';
UPDATE public.product_reviews SET product_slug = 'plant-based-smoky-bbq-lentils' WHERE product_slug = 'smoky-bbq-lentils';

-- Allow reviews on bundles (which live in public.bundles, not products).
CREATE OR REPLACE FUNCTION public.validate_review_product_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF EXISTS (SELECT 1 FROM public.products WHERE slug = NEW.product_slug) THEN
    RETURN NEW;
  END IF;
  -- Accept Shopify bundle handles (bundles table has no slug column;
  -- handles are managed in Shopify). Validate format only.
  IF NEW.product_slug ~ '^[a-z0-9][a-z0-9-]{1,80}$' THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'product_slug % is not a valid product or bundle handle', NEW.product_slug;
END;
$function$;
