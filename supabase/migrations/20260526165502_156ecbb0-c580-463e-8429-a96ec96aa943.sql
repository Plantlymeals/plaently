REVOKE EXECUTE ON FUNCTION public.get_internal_webhook_secret() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_internal_webhook_secret() TO service_role;