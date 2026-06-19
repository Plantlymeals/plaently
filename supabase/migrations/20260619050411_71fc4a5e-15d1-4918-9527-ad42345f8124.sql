DROP POLICY IF EXISTS "Anyone can submit a review" ON public.product_reviews;
CREATE POLICY "Anyone can submit a review"
  ON public.product_reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR status = 'pending'::public.review_status
  );