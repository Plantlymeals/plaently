CREATE TABLE public.starter_pack_offer_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  shopify_price_rule_id text,
  shopify_discount_code_id text,
  market text NOT NULL DEFAULT 'SE',
  issued_at timestamptz NOT NULL DEFAULT now(),
  redeemed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX starter_pack_offer_codes_email_key ON public.starter_pack_offer_codes (lower(email));
CREATE UNIQUE INDEX starter_pack_offer_codes_code_key ON public.starter_pack_offer_codes (code);

GRANT ALL ON public.starter_pack_offer_codes TO service_role;
ALTER TABLE public.starter_pack_offer_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No client reads on starter_pack_offer_codes" ON public.starter_pack_offer_codes FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "No client inserts on starter_pack_offer_codes" ON public.starter_pack_offer_codes FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No client updates on starter_pack_offer_codes" ON public.starter_pack_offer_codes FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No client deletes on starter_pack_offer_codes" ON public.starter_pack_offer_codes FOR DELETE TO anon, authenticated USING (false);

CREATE TRIGGER update_starter_pack_offer_codes_updated_at
BEFORE UPDATE ON public.starter_pack_offer_codes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.starter_pack_offer_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX starter_pack_offer_attempts_ip_time_idx ON public.starter_pack_offer_attempts (ip_hash, created_at DESC);

GRANT ALL ON public.starter_pack_offer_attempts TO service_role;
ALTER TABLE public.starter_pack_offer_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No client reads on starter_pack_offer_attempts" ON public.starter_pack_offer_attempts FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "No client inserts on starter_pack_offer_attempts" ON public.starter_pack_offer_attempts FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No client updates on starter_pack_offer_attempts" ON public.starter_pack_offer_attempts FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "No client deletes on starter_pack_offer_attempts" ON public.starter_pack_offer_attempts FOR DELETE TO anon, authenticated USING (false);

CREATE OR REPLACE FUNCTION public.starter_pack_offer_issued_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::integer FROM public.starter_pack_offer_codes;
$$;

GRANT EXECUTE ON FUNCTION public.starter_pack_offer_issued_count() TO anon, authenticated, service_role;