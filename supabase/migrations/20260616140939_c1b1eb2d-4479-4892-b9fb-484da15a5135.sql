GRANT SELECT ON public.bundles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.bundles TO authenticated;
GRANT ALL ON public.bundles TO service_role;