CREATE OR REPLACE FUNCTION public.publish_due_blog_posts()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.blog_posts
  SET is_published = true
  WHERE is_published = false
    AND published_at IS NOT NULL
    AND published_at <= now();

  GET DIAGNOSTICS updated_count = ROW_COUNT;

  IF updated_count > 0 THEN
    BEGIN
      PERFORM net.http_post(
        url := 'https://fpwwjbevjhxbggtkaabc.supabase.co/functions/v1/gsc-submit-sitemap',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Lovable-Context', 'cron',
          'Authorization', 'Bearer ' || (
            SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key'
          )
        ),
        body := jsonb_build_object('reason', 'scheduled_blog_publish', 'published', updated_count)
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'publish_due_blog_posts: GSC sitemap submit failed: %', SQLERRM;
    END;
  END IF;

  RETURN updated_count;
END;
$function$;