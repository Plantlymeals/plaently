REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM anon;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM anon;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM authenticated;