
-- 1. Email validation on newsletter_subscribers
ALTER TABLE public.newsletter_subscribers
  ADD CONSTRAINT newsletter_subscribers_email_format
  CHECK (
    char_length(email) <= 254
    AND email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'
  );

-- 2. Storage RLS for email-assets bucket
CREATE POLICY "email-assets public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'email-assets');

CREATE POLICY "email-assets admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "email-assets admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "email-assets admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'));

-- 3. Store internal webhook secret in Vault
SELECT vault.create_secret(
  '3cc93121-06f1-4c23-a60d-6bd22080f39e',
  'internal_webhook_secret',
  'Shared secret sent by DB triggers to internal-only edge function paths'
);

-- 4. Update welcome trigger to send the internal secret header
CREATE OR REPLACE FUNCTION public.notify_newsletter_welcome()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  webhook_secret text;
BEGIN
  SELECT decrypted_secret INTO webhook_secret
    FROM vault.decrypted_secrets
    WHERE name = 'internal_webhook_secret'
    LIMIT 1;

  PERFORM net.http_post(
    url := 'https://fpwwjbevjhxbggtkaabc.supabase.co/functions/v1/send-newsletter',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-internal-secret', webhook_secret
    ),
    body := jsonb_build_object(
      'type', 'welcome',
      'record', jsonb_build_object('email', NEW.email)
    )
  );

  RETURN NEW;
END;
$function$;

-- 5. Restrict execute on internal SECURITY DEFINER functions to service_role only.
--    has_role stays callable by authenticated (used by RLS policies / app code).
REVOKE EXECUTE ON FUNCTION public.notify_newsletter_welcome() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
