DROP POLICY "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can manage bundles" ON public.bundles;
CREATE POLICY "Admins can manage bundles" ON public.bundles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can update submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY "Admins can view submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can manage FAQs" ON public.faqs;
CREATE POLICY "Admins can manage FAQs" ON public.faqs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can manage hero content" ON public.hero_content;
CREATE POLICY "Admins can manage hero content" ON public.hero_content FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY "Published products are publicly readable" ON public.products;
CREATE POLICY "Published products are publicly readable" ON public.products FOR SELECT TO anon, authenticated USING (is_published = true);

DROP POLICY "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY "Admins can read all reviews" ON public.product_reviews;
CREATE POLICY "Admins can read all reviews" ON public.product_reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY "Admins can update reviews" ON public.product_reviews;
CREATE POLICY "Admins can update reviews" ON public.product_reviews FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY "Admins can delete reviews" ON public.product_reviews;
CREATE POLICY "Admins can delete reviews" ON public.product_reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY "Anyone can submit a review" ON public.product_reviews;
CREATE POLICY "Anyone can submit a review" ON public.product_reviews FOR INSERT TO anon WITH CHECK (status = 'pending'::review_status);
CREATE POLICY "Signed-in users can submit a review" ON public.product_reviews FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR status = 'pending'::review_status);

DROP POLICY "Admins can view replies" ON public.message_replies;
CREATE POLICY "Admins can view replies" ON public.message_replies FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY "Admins can insert replies" ON public.message_replies;
CREATE POLICY "Admins can insert replies" ON public.message_replies FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY "Admins can update replies" ON public.message_replies;
CREATE POLICY "Admins can update replies" ON public.message_replies FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY "Admins can delete replies" ON public.message_replies;
CREATE POLICY "Admins can delete replies" ON public.message_replies FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;