import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SHOPIFY_STORE_DOMAIN = 'plantly-website-cms-fyvdr.myshopify.com';
const SHOPIFY_ADMIN_API = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07`;
const SHOPIFY_ONLINE_TOKEN_PREFIX = 'SHOPIFY_ONLINE_ACCESS_TOKEN:user:';

function getShopifyToken(userId: string) {
  const exactOnlineToken = Deno.env.get(`${SHOPIFY_ONLINE_TOKEN_PREFIX}${userId}`);
  if (exactOnlineToken) return { token: exactOnlineToken, source: 'exact-online' };

  // Shopify connector online tokens are keyed by the connector user id, not by
  // the app auth user UUID. This admin-only function can safely use the active
  // connector token when the exact auth-keyed lookup is not present.
  const connectorOnlineToken = Object.entries(Deno.env.toObject()).find(
    ([key, value]) => key.startsWith(SHOPIFY_ONLINE_TOKEN_PREFIX) && Boolean(value),
  )?.[1];

  if (connectorOnlineToken) return { token: connectorOnlineToken, source: 'connector-online' };
  const staticToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN') || '';
  return { token: staticToken, source: staticToken ? 'static' : 'missing' };
}

async function shopify(path: string, token: string, init: RequestInit = {}) {
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
    throw new Error(`Shopify ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
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

    // Prefer a live Shopify connector online token; fall back to static token only if needed.
    const { token: shopifyToken, source: shopifyTokenSource } = getShopifyToken(userData.user.id);
    console.log(`shopify-discounts token source: ${shopifyTokenSource}`);
    if (!shopifyToken) {
      return json({ error: 'No Shopify access token available. Please reconnect Shopify in the admin.' }, 401);
    }

    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};
    const action = body.action as string;

    switch (action) {
      case 'list': {
        const rules = await shopify('/price_rules.json?limit=100', shopifyToken);
        const enriched = await Promise.all(
          (rules.price_rules || []).map(async (r: any) => {
            try {
              const codes = await shopify(`/price_rules/${r.id}/discount_codes.json`, shopifyToken);
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
        const created = await shopify('/price_rules.json', shopifyToken, {
          method: 'POST',
          body: JSON.stringify({ price_rule: rule }),
        });
        const ruleId = created.price_rule.id;
        if (code) {
          await shopify(`/price_rules/${ruleId}/discount_codes.json`, shopifyToken, {
            method: 'POST',
            body: JSON.stringify({ discount_code: { code } }),
          });
        }
        return json({ ok: true, price_rule: created.price_rule });
      }
      case 'update': {
        const { price_rule_id, rule } = body;
        const updated = await shopify(`/price_rules/${price_rule_id}.json`, shopifyToken, {
          method: 'PUT',
          body: JSON.stringify({ price_rule: { id: price_rule_id, ...rule } }),
        });
        return json({ ok: true, price_rule: updated.price_rule });
      }
      case 'disable': {
        const { price_rule_id } = body;
        // Set ends_at to now to disable
        const endsAt = new Date().toISOString();
        const updated = await shopify(`/price_rules/${price_rule_id}.json`, shopifyToken, {
          method: 'PUT',
          body: JSON.stringify({ price_rule: { id: price_rule_id, ends_at: endsAt } }),
        });
        return json({ ok: true, price_rule: updated.price_rule });
      }
      case 'delete': {
        const { price_rule_id } = body;
        await shopify(`/price_rules/${price_rule_id}.json`, shopifyToken, { method: 'DELETE' });
        return json({ ok: true });
      }
      default:
        return json({ error: 'Unknown action' }, 400);
    }
  } catch (e) {
    console.error('shopify-discounts error:', e);
    return json({ error: (e as Error).message }, 500);
  }
});