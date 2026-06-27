import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SHOPIFY_STORE_DOMAIN = 'plantly-website-cms-fyvdr.myshopify.com';
const SHOPIFY_ADMIN_API = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07`;
const SHOPIFY_ONLINE_TOKEN_PREFIX = 'SHOPIFY_ONLINE_ACCESS_TOKEN:user:';

class ShopifyAuthError extends Error {}

function getShopifyTokenCandidates(userId: string) {
  const candidates: Array<{ token: string; source: string }> = [];
  const addCandidate = (token: string | undefined | null, source: string) => {
    if (!token || candidates.some((candidate) => candidate.token === token)) return;
    candidates.push({ token, source });
  };

  // Prefer a permanent Admin API token if one is configured. The managed
  // Shopify connector tokens can expire or be revoked when account access
  // changes, but admin discount management needs stable backend credentials.
  addCandidate(Deno.env.get('SHOPIFY_ADMIN_API_ACCESS_TOKEN'), 'admin-api');
  addCandidate(Deno.env.get('SHOPIFY_ADMIN_ACCESS_TOKEN'), 'admin');
  addCandidate(Deno.env.get(`${SHOPIFY_ONLINE_TOKEN_PREFIX}${userId}`), 'exact-online');

  // Shopify connector online tokens are keyed by the connector user id, not by
  // the app auth user UUID. This admin-only function can safely try the active
  // connector token when the exact auth-keyed lookup is not present.
  for (const [key, value] of Object.entries(Deno.env.toObject())) {
    if (key.startsWith(SHOPIFY_ONLINE_TOKEN_PREFIX)) addCandidate(value, 'connector-online');
  }

  addCandidate(Deno.env.get('SHOPIFY_ACCESS_TOKEN'), 'static');
  return candidates;
}

async function shopify(path: string, token: string, source: string, init: RequestInit = {}) {
  const res = await fetch(`${SHOPIFY_ADMIN_API}${path}`, {
    ...init,
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = { raw: text }; }
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new ShopifyAuthError(`Shopify authorization failed for ${source}: ${res.status}`);
    }
    throw new Error(`Shopify ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

async function shopifyWithFallback(path: string, candidates: Array<{ token: string; source: string }>, init: RequestInit = {}) {
  let authFailures = 0;
  for (const candidate of candidates) {
    try {
      const data = await shopify(path, candidate.token, candidate.source, init);
      console.log(`shopify-discounts token source: ${candidate.source}`);
      return data;
    } catch (error) {
      if (!(error instanceof ShopifyAuthError)) throw error;
      authFailures++;
      console.warn((error as Error).message);
    }
  }

  if (authFailures > 0) {
    throw new ShopifyAuthError('Shopify authorization failed. Add a valid Shopify Admin API access token for this store (the custom-app token starts with shpat_) and try again.');
  }
  throw new ShopifyAuthError('No Shopify Admin API access token available. Add a valid Shopify Admin API access token for this store and try again.');
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Auth: validate JWT and admin role
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return json({ error: 'Missing auth' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData.user) return json({ error: 'Invalid auth' }, 401);
    const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: userData.user.id, _role: 'admin' });
    if (!isAdmin) return json({ error: 'Forbidden' }, 403);

    // Try live Shopify connector tokens before falling back to the static token.
    const shopifyTokens = getShopifyTokenCandidates(userData.user.id);
    if (shopifyTokens.length === 0) return json({ error: 'No Shopify Admin API access token available. Add a valid Shopify Admin API access token for this store and try again.' }, 401);

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const action = body.action as string;

    switch (action) {
      case 'list': {
        const rules = await shopifyWithFallback('/price_rules.json?limit=100', shopifyTokens);
        const enriched = await Promise.all(
          (rules.price_rules || []).map(async (r: any) => {
            try {
              const codes = await shopifyWithFallback(`/price_rules/${r.id}/discount_codes.json`, shopifyTokens);
              return { ...r, discount_codes: codes.discount_codes || [] };
            } catch {
              return { ...r, discount_codes: [] };
            }
          })
        );
        return json({ rules: enriched });
      }
      case 'create': {
        const { rule, code } = body;
        const created = await shopifyWithFallback('/price_rules.json', shopifyTokens, {
          method: 'POST',
          body: JSON.stringify({ price_rule: rule }),
        });
        const ruleId = created.price_rule.id;
        if (code) {
          await shopifyWithFallback(`/price_rules/${ruleId}/discount_codes.json`, shopifyTokens, {
            method: 'POST',
            body: JSON.stringify({ discount_code: { code } }),
          });
        }
        return json({ ok: true, price_rule: created.price_rule });
      }
      case 'update': {
        const { price_rule_id, rule } = body;
        const updated = await shopifyWithFallback(`/price_rules/${price_rule_id}.json`, shopifyTokens, {
          method: 'PUT',
          body: JSON.stringify({ price_rule: { id: price_rule_id, ...rule } }),
        });
        return json({ ok: true, price_rule: updated.price_rule });
      }
      case 'disable': {
        const { price_rule_id } = body;
        // Set ends_at to now to disable
        const endsAt = new Date().toISOString();
        const updated = await shopifyWithFallback(`/price_rules/${price_rule_id}.json`, shopifyTokens, {
          method: 'PUT',
          body: JSON.stringify({ price_rule: { id: price_rule_id, ends_at: endsAt } }),
        });
        return json({ ok: true, price_rule: updated.price_rule });
      }
      case 'delete': {
        const { price_rule_id } = body;
        await shopifyWithFallback(`/price_rules/${price_rule_id}.json`, shopifyTokens, { method: 'DELETE' });
        return json({ ok: true });
      }
      default:
        return json({ error: 'Unknown action' }, 400);
    }
  } catch (e) {
    console.error('shopify-discounts error:', e);
    if (e instanceof ShopifyAuthError) return json({ error: (e as Error).message }, 401);
    return json({ error: (e as Error).message }, 500);
  }
});