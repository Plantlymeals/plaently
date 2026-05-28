DROP TRIGGER IF EXISTS on_newsletter_subscribe ON public.newsletter_subscribers;
DROP TRIGGER IF EXISTS newsletter_welcome_trigger ON public.newsletter_subscribers;
DROP FUNCTION IF EXISTS public.notify_newsletter_welcome();