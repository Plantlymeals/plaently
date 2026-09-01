-- Lock down email_send_state: service_role only
REVOKE ALL ON public.email_send_state FROM anon, authenticated;
GRANT ALL ON public.email_send_state TO service_role;
ALTER TABLE public.email_send_state ENABLE ROW LEVEL SECURITY;

-- Lock down review_requests: admins may read only, no client writes
REVOKE ALL ON public.review_requests FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.review_requests FROM authenticated;
GRANT SELECT ON public.review_requests TO authenticated;
GRANT ALL ON public.review_requests TO service_role;
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No client inserts on review_requests" ON public.review_requests;
CREATE POLICY "No client inserts on review_requests"
ON public.review_requests FOR INSERT TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "No client updates on review_requests" ON public.review_requests;
CREATE POLICY "No client updates on review_requests"
ON public.review_requests FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No client deletes on review_requests" ON public.review_requests;
CREATE POLICY "No client deletes on review_requests"
ON public.review_requests FOR DELETE TO anon, authenticated USING (false);