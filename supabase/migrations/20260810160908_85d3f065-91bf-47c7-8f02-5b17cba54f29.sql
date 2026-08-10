CREATE OR REPLACE FUNCTION public.publish_due_blog_posts()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.blog_posts
  SET is_published = true
  WHERE is_published = false
    AND published_at IS NOT NULL
    AND published_at <= now();

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.publish_due_blog_posts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_due_blog_posts() TO service_role;

-- Allow the service role (used by scheduled jobs) to publish scheduled posts.
CREATE POLICY "Service role can publish scheduled blog posts" ON public.blog_posts
FOR UPDATE TO service_role
USING (true)
WITH CHECK (true);

-- Check every hour for posts whose scheduled publish time has passed.
SELECT cron.schedule(
  'publish-scheduled-blog-posts',
  '0 * * * *',
  'SELECT public.publish_due_blog_posts();'
);