// Public, always-fresh XML sitemap. Reads published blog posts from the database
// and product handles from Shopify on every request, so newly published content
// is discoverable by Google without a redeploy.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const BASE_URL = 'https://plaently.com'
const SHOPIFY_DOMAIN = 'plantly-website-cms-fyvdr.myshopify.com'
const SHOPIFY_API_VERSION = '2025-07'

interface Entry {
  path: string
  lastmod?: string
  changefreq?: string
  priority?: string
}

const staticEntries: Entry[] = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '1.0' },
  { path: '/nutrition', changefreq: 'monthly', priority: '0.7' },
  { path: '/lifestyle', changefreq: 'monthly', priority: '0.7' },
  { path: '/high-protein-meals', changefreq: 'monthly', priority: '0.85' },
  { path: '/plant-based-meals', changefreq: 'monthly', priority: '0.85' },
  { path: '/healthy-instant-meals', changefreq: 'monthly', priority: '0.85' },
  { path: '/healthy-fast-food', changefreq: 'monthly', priority: '0.9' },
  { path: '/protein-cups', changefreq: 'monthly', priority: '0.85' },
  { path: '/proteinrika-maltider', changefreq: 'monthly', priority: '0.85' },
  { path: '/plantbaserade-maltider', changefreq: 'monthly', priority: '0.85' },
  { path: '/halsosamma-snabbmaltider', changefreq: 'monthly', priority: '0.85' },
  { path: '/nyttig-snabbmat', changefreq: 'monthly', priority: '0.9' },
  { path: '/proteinkoppar', changefreq: 'monthly', priority: '0.85' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog/category/future-of-fast-food', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/category/modern-nutrition', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/category/fuel-your-day', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/category/plant-protein-101', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/category/behind-plantly', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/category/conscious-living', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/category/quick-and-real', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/category/performance-and-recovery', changefreq: 'monthly', priority: '0.7' },
  { path: '/faq', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/frakt', changefreq: 'yearly', priority: '0.4' },
  { path: '/integritetspolicy', changefreq: 'yearly', priority: '0.3' },
  { path: '/kopsvillkor', changefreq: 'yearly', priority: '0.3' },
  { path: '/shipping', changefreq: 'yearly', priority: '0.4' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
]

async function blogEntries(): Promise<Entry[]> {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    )
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('is_published', true)
    if (error || !data) return []
    return data.map((r) => ({
      path: `/blog/${r.slug}`,
      lastmod: r.updated_at?.slice(0, 10),
      changefreq: 'monthly',
      priority: '0.7',
    }))
  } catch (_e) {
    return []
  }
}

async function productEntries(): Promise<Entry[]> {
  const token = Deno.env.get('SHOPIFY_STOREFRONT_ACCESS_TOKEN')
  if (!token) return []
  try {
    const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
      body: JSON.stringify({ query: '{ products(first: 100) { edges { node { handle updatedAt } } } }' }),
    })
    if (!res.ok) return []
    const json = await res.json()
    const edges = json?.data?.products?.edges ?? []
    return edges.map((e: { node: { handle: string; updatedAt?: string } }) => ({
      path: `/product/${e.node.handle}`,
      lastmod: e.node.updatedAt?.slice(0, 10),
      changefreq: 'weekly',
      priority: '0.8',
    }))
  } catch (_e) {
    return []
  }
}

function render(entries: Entry[]) {
  const urls = entries.map((e) =>
    [
      '  <url>',
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      '  </url>',
    ].filter(Boolean).join('\n'),
  )
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const [blog, products] = await Promise.all([blogEntries(), productEntries()])
  const xml = render([...staticEntries, ...blog, ...products])

  return new Response(xml, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
})
