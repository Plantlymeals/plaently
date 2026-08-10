// Admin-only: re-submits the sitemap to Google Search Console so newly published
// content is picked up faster. Google deprecated the anonymous sitemap "ping",
// so this uses the authenticated Search Console API via the Lovable connector gateway.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const GATEWAY = 'https://connector-gateway.lovable.dev/google_search_console'
const SITEMAP_URL = 'https://plaently.com/sitemap.xml'
const SITE_ORIGIN = 'https://plaently.com/'

interface SiteEntry { siteUrl: string; permissionLevel?: string }

function coversTarget(siteUrl: string, target: URL) {
  if (siteUrl.startsWith('sc-domain:')) {
    const domain = siteUrl.slice('sc-domain:'.length).toLowerCase()
    const host = target.hostname.toLowerCase()
    return host === domain || host.endsWith(`.${domain}`)
  }
  try {
    return target.href.startsWith(new URL(siteUrl).href)
  } catch {
    return false
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    // --- Auth: caller must be an admin, or the internal cron (service role) ---
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)
    const token = authHeader.slice('Bearer '.length).trim()
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const isInternalCron = !!serviceRoleKey && token === serviceRoleKey

    if (!isInternalCron) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } },
      )
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) return json({ error: 'Unauthorized' }, 401)

      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: userData.user.id,
        _role: 'admin',
      })
      if (!isAdmin) return json({ error: 'Forbidden' }, 403)
    }

    // --- Search Console credentials ---
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    const connectionKey = Deno.env.get('GOOGLE_SEARCH_CONSOLE_API_KEY')
    if (!lovableApiKey || !connectionKey) {
      return json({ error: 'Search Console is not connected for this project' }, 400)
    }
    const headers = {
      Authorization: `Bearer ${lovableApiKey}`,
      'X-Connection-Api-Key': connectionKey,
    }

    // --- Resolve a verified property covering the site ---
    const sitesRes = await fetch(`${GATEWAY}/webmasters/v3/sites`, { headers })
    if (!sitesRes.ok) {
      const details = await sitesRes.text()
      console.error(`GSC sites list failed [${sitesRes.status}]: ${details}`)
      return json({ error: 'Could not list Search Console properties', status: sitesRes.status, details }, sitesRes.status)
    }
    const { siteEntry = [] } = (await sitesRes.json()) as { siteEntry?: SiteEntry[] }
    const target = new URL(SITE_ORIGIN)
    const matches = siteEntry.filter(
      (e) => e.permissionLevel !== 'siteUnverifiedUser' && coversTarget(e.siteUrl, target),
    )
    if (matches.length === 0) return json({ error: 'No verified Search Console property covers this site' }, 400)

    // --- Submit the sitemap for every matching property ---
    const results: Array<{ siteUrl: string; ok: boolean; status: number; details?: string }> = []
    for (const m of matches) {
      const res = await fetch(
        `${GATEWAY}/webmasters/v3/sites/${encodeURIComponent(m.siteUrl)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`,
        { method: 'PUT', headers },
      )
      const ok = res.ok
      results.push({
        siteUrl: m.siteUrl,
        ok,
        status: res.status,
        details: ok ? undefined : await res.text(),
      })
    }

    const anyOk = results.some((r) => r.ok)
    return json({ submitted: anyOk, sitemap: SITEMAP_URL, results }, anyOk ? 200 : 502)
  } catch (e) {
    console.error('gsc-submit-sitemap error', e)
    return json({ error: String(e) }, 500)
  }
})
