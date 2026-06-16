
-- Allow admins to audit the email send log via the app
CREATE POLICY "Admins can read email send log"
ON public.email_send_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Allow admins to review the suppression list via the app
CREATE POLICY "Admins can read suppressed emails"
ON public.suppressed_emails
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Unsubscribe tokens are security credentials; remove admin bulk read access.
-- The service role (used by edge functions) retains full access for token redemption.
DROP POLICY IF EXISTS "Admins can read unsubscribe tokens" ON public.email_unsubscribe_tokens;
