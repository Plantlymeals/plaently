-- Status enum
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');

-- Reviews table
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  rating SMALLINT NOT NULL,
  title TEXT,
  body TEXT NOT NULL,
  status public.review_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Validation via trigger (avoid CHECK on enum/range mixing)
CREATE OR REPLACE FUNCTION public.validate_product_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;
  IF length(trim(NEW.author_name)) = 0 OR length(NEW.author_name) > 100 THEN
    RAISE EXCEPTION 'author_name must be 1-100 chars';
  END IF;
  IF length(NEW.author_email) > 255 OR NEW.author_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'author_email is invalid';
  END IF;
  IF length(trim(NEW.body)) < 5 OR length(NEW.body) > 2000 THEN
    RAISE EXCEPTION 'body must be 5-2000 chars';
  END IF;
  IF NEW.title IS NOT NULL AND length(NEW.title) > 150 THEN
    RAISE EXCEPTION 'title must be <= 150 chars';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_product_review_trigger
BEFORE INSERT OR UPDATE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.validate_product_review();

-- Force inserts from non-admins to status='pending' and clear approved_at
CREATE OR REPLACE FUNCTION public.enforce_review_pending_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    NEW.status := 'pending';
    NEW.approved_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_review_pending_on_insert_trigger
BEFORE INSERT ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.enforce_review_pending_on_insert();

-- updated_at trigger
CREATE TRIGGER update_product_reviews_updated_at
BEFORE UPDATE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_product_reviews_slug_status ON public.product_reviews(product_slug, status);
CREATE INDEX idx_product_reviews_status_created ON public.product_reviews(status, created_at DESC);

-- Grants
GRANT SELECT, INSERT ON public.product_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_reviews TO authenticated;
GRANT ALL ON public.product_reviews TO service_role;

-- RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read only approved reviews
CREATE POLICY "Approved reviews are publicly readable"
ON public.product_reviews
FOR SELECT
USING (status = 'approved');

-- Anyone can submit a review (status forced to pending by trigger)
CREATE POLICY "Anyone can submit a review"
ON public.product_reviews
FOR INSERT
WITH CHECK (true);

-- Admins can read everything (overlapping permissive policy)
CREATE POLICY "Admins can read all reviews"
ON public.product_reviews
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can update (approve/reject)
CREATE POLICY "Admins can update reviews"
ON public.product_reviews
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can delete
CREATE POLICY "Admins can delete reviews"
ON public.product_reviews
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));