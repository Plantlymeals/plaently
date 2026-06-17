-- The contact_submissions table was missing Data API GRANTs, which caused
-- every public submission to fail with a permission/RLS error.
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;