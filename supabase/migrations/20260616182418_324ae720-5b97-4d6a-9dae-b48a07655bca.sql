CREATE TABLE public.message_replies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES public.contact_submissions(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email text,
  body text NOT NULL,
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.message_replies TO authenticated;
GRANT ALL ON public.message_replies TO service_role;

ALTER TABLE public.message_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view replies" ON public.message_replies
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert replies" ON public.message_replies
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update replies" ON public.message_replies
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete replies" ON public.message_replies
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX message_replies_submission_id_idx ON public.message_replies(submission_id, created_at);

CREATE TRIGGER update_message_replies_updated_at
  BEFORE UPDATE ON public.message_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();