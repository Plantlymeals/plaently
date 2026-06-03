
UPDATE public.products SET price = '35 kr';

UPDATE public.bundles SET price = '399 kr',  per_meal_price = '33 kr'  WHERE meal_count = 12;
UPDATE public.bundles SET price = '789 kr',  per_meal_price = '33 kr'  WHERE meal_count = 24;
UPDATE public.bundles SET price = '1890 kr', per_meal_price = '32 kr'  WHERE meal_count = 60;
UPDATE public.bundles SET price = '3690 kr', per_meal_price = '31 kr'  WHERE meal_count = 120;
