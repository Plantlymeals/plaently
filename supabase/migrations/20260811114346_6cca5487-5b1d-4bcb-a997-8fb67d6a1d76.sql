UPDATE public.bundles
SET sort_order = CASE name
  WHEN 'Starter Pack' THEN 1
  WHEN 'Monthly Box' THEN 2
  ELSE sort_order
END
WHERE name IN ('Starter Pack', 'Monthly Box');

UPDATE public.bundles
SET badge = 'Italian Favourite'
WHERE name = 'Bolognese Box';
