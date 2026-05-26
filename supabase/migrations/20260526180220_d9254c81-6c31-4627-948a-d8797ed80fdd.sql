DROP TRIGGER IF EXISTS newsletter_welcome_trigger ON public.newsletter_subscribers;
CREATE TRIGGER newsletter_welcome_trigger
AFTER INSERT ON public.newsletter_subscribers
FOR EACH ROW EXECUTE FUNCTION public.notify_newsletter_welcome();