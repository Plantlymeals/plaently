CREATE POLICY "Admins can read unsubscribe tokens"
ON public.email_unsubscribe_tokens
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));