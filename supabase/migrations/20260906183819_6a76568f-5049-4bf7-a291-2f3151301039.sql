DROP FUNCTION IF EXISTS public.starter_offer_redeemed_count();
DROP FUNCTION IF EXISTS public.starter_pack_offer_issued_count();
REVOKE EXECUTE ON FUNCTION public.admin_list_reviews(public.review_status) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_reviews(public.review_status) TO service_role;