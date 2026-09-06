CREATE TABLE public.starter_offer_redemptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shopify_order_id text NOT NULL UNIQUE,
  order_number text,
  customer_email text,
  discount_amount numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.starter_offer_redemptions TO service_role;

ALTER TABLE public.starter_offer_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all access to anon and authenticated"
ON public.starter_offer_redemptions
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.starter_offer_redeemed_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT count(*)::integer FROM public.starter_offer_redemptions;
$$;

GRANT EXECUTE ON FUNCTION public.starter_offer_redeemed_count() TO anon, authenticated, service_role;