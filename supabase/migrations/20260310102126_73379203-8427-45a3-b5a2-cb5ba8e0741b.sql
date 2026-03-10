
-- Drop all restrictive policies and recreate as permissive

-- blog_posts
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Published posts are publicly readable" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Published posts are publicly readable" ON public.blog_posts FOR SELECT USING (is_published = true);

-- bundles
DROP POLICY IF EXISTS "Admins can manage bundles" ON public.bundles;
DROP POLICY IF EXISTS "Bundles are publicly readable" ON public.bundles;
CREATE POLICY "Admins can manage bundles" ON public.bundles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Bundles are publicly readable" ON public.bundles FOR SELECT USING (is_published = true);

-- contact_submissions
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Admins can update submissions" ON public.contact_submissions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- faqs
DROP POLICY IF EXISTS "Admins can manage FAQs" ON public.faqs;
DROP POLICY IF EXISTS "FAQs are publicly readable" ON public.faqs;
CREATE POLICY "Admins can manage FAQs" ON public.faqs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "FAQs are publicly readable" ON public.faqs FOR SELECT USING (is_published = true);

-- hero_content
DROP POLICY IF EXISTS "Admins can manage hero content" ON public.hero_content;
DROP POLICY IF EXISTS "Hero content is publicly readable" ON public.hero_content;
CREATE POLICY "Admins can manage hero content" ON public.hero_content FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Hero content is publicly readable" ON public.hero_content FOR SELECT USING (true);

-- newsletter_subscribers
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- products
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);

-- testimonials
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Testimonials are publicly readable" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Testimonials are publicly readable" ON public.testimonials FOR SELECT USING (is_published = true);

-- user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
