
CREATE OR REPLACE FUNCTION public.notify_newsletter_welcome()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  edge_url text;
  anon_key text;
BEGIN
  edge_url := current_setting('app.settings.supabase_url', true);
  anon_key := current_setting('app.settings.supabase_anon_key', true);

  -- Use net extension to call edge function asynchronously
  PERFORM net.http_post(
    url := 'https://fpwwjbevjhxbggtkaabc.supabase.co/functions/v1/send-newsletter',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'type', 'welcome',
      'record', jsonb_build_object('email', NEW.email)
    )
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_newsletter_subscribe
  AFTER INSERT ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_newsletter_welcome();
