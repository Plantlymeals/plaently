-- Add admin SELECT policy for newsletter_subscribers
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));