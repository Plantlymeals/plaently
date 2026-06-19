DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
CREATE POLICY "Published products are publicly readable"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'::public.app_role));