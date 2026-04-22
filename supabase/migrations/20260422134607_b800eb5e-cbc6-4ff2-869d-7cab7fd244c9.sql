
UPDATE public.blog_posts
SET content = regexp_replace(content, '3\s*[-–]\s*5\s*minutes', '5 minutes', 'gi')
WHERE content ~* '3\s*[-–]\s*5\s*minutes';

UPDATE public.blog_posts
SET content = regexp_replace(content, '3\s*[-–]\s*5\s*minuter', '5 minuter', 'gi')
WHERE content ~* '3\s*[-–]\s*5\s*minuter';

UPDATE public.blog_posts
SET content = regexp_replace(content, '3\s*[-–]\s*5\s*min\b', '5 min', 'gi')
WHERE content ~* '3\s*[-–]\s*5\s*min\b';

UPDATE public.blog_posts
SET excerpt = regexp_replace(excerpt, '3\s*[-–]\s*5\s*(minutes|minuter|min)\b', '5 \1', 'gi')
WHERE excerpt ~* '3\s*[-–]\s*5\s*(minutes|minuter|min)\b';
