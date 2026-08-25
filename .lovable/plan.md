# Migrate PLÄNTLY to TanStack Start

Move the project from the Classic stack (Vite + React Router) to TanStack Start so page metadata (title, description, canonical, hreflang, JSON-LD) ships in server-rendered HTML — which social crawlers and AI search bots read, unlike the current client-side tags.

## What you get

- Server-side rendering for every page, so Facebook/LinkedIn/X previews and AI crawlers see real metadata.
- Faster first paint and better crawl coverage for blog posts, product pages and the SV/EN pairs.
- Same design, same content, same Cloud backend, same Shopify checkout.

## What the migration does

1. Preflight: confirm the project builds cleanly today. If it doesn't, the migration stops and I report the errors instead of starting on a broken baseline.
2. Scan and report the project shape: routes, providers, Supabase client and edge functions, custom theme tokens, `index.html` additions (GA4, cookie consent, OG tags, favicon, preloads), `main.tsx` init code, custom scripts.
3. Swap framework scaffolding: new `vite.config.ts`, `tsconfig.json`, `src/router.tsx`, `src/server.ts`, `src/start.ts`, `src/styles.css` (with the PLÄNTLY green tokens and Poppins re-applied on top).
4. Merge `package.json`, keeping your dependencies and custom scripts.
5. Replace SPA entry points (`index.html`, `src/main.tsx`, `src/App.tsx`) with file-based routes under `src/routes/`, including `__root.tsx` carrying the head metadata, providers, cookie consent and GA4 wiring.
6. Re-create every route (home, products, product detail, bundles, blog, blog post, category/landing pages, legal pages, contact, admin, admin login, unsubscribe, catch-all 404) with the same paths, plus the existing canonical/hreflang logic intact.
7. Keep admin auth guards in place — every protected route is inventoried and verified so nothing becomes public.
8. Edge functions and database stay untouched; the Cloud backend keeps working as-is.
9. Verify: production build green, TypeScript clean, key routes served and screenshot-checked.

## Risks and notes

- Sitemap, robots.txt, GSC submissions and the cron jobs are unaffected.
- The preview keeps showing the current app until the migration finishes.
- If anything looks wrong afterwards, you can revert this turn from chat history and the project returns to the current stack, including publishing.
- Cost: runs as normal chat work (typically 10–35 credits), no separate migration fee.

## Technical detail

Router: `@tanstack/react-router` file-based routes with a compat shim so existing `useNavigate` / `useParams` / `useSearchParams` call sites keep working. React Query moves into `src/router.tsx` with the current `defaultOptions` preserved. Tailwind v4 via `@tailwindcss/vite`; v3-only class patterns (`shadow`, `rounded`, `ring`, `outline-none`, `bg-[--var]`) are swept and rewritten. `strict: true` in the new tsconfig — the resulting type errors get fixed properly, not silenced.
