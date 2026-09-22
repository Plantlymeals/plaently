-- The product-media bucket no longer exists; these policies are orphaned.
-- Remove the unrestricted public read policy (and its sibling admin policies)
-- so no rule grants unscoped read access to storage objects.
DROP POLICY IF EXISTS "Public can read product-media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product-media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product-media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product-media" ON storage.objects;