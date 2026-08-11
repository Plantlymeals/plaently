REVOKE EXECUTE ON FUNCTION public.publish_due_blog_posts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_due_blog_posts() TO service_role;

REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch() TO service_role;

REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.email_queue_wake() TO service_role;