
ALTER TABLE public.bundles
  ADD COLUMN IF NOT EXISTS shopify_product_id text;

COMMENT ON COLUMN public.bundles.shopify_product_id IS 'Shopify product GID (gid://shopify/Product/...) this bundle is sold as.';
