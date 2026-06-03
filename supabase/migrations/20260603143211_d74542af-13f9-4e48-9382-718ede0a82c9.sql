
-- Hide author_email from public SELECT on product_reviews via column-level privileges
REVOKE SELECT ON public.product_reviews FROM anon;
REVOKE SELECT ON public.product_reviews FROM authenticated;

-- Re-grant SELECT on all columns EXCEPT author_email
GRANT SELECT (id, product_slug, author_name, rating, title, body, status, created_at, updated_at, approved_at)
  ON public.product_reviews TO anon;
GRANT SELECT (id, product_slug, author_name, rating, title, body, status, created_at, updated_at, approved_at)
  ON public.product_reviews TO authenticated;

-- Admin-only RPC to fetch full reviews including author_email
CREATE OR REPLACE FUNCTION public.admin_list_reviews(_status review_status)
RETURNS SETOF public.product_reviews
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
    SELECT * FROM public.product_reviews
    WHERE status = _status
    ORDER BY created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_reviews(review_status) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_reviews(review_status) TO authenticated, service_role;
