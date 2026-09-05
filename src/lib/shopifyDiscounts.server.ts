// Shopify Admin API helpers for discount management (server only).
const SHOPIFY_STORE_DOMAIN = 'plantly-website-cms-fyvdr.myshopify.com';
const SHOPIFY_ADMIN_API = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07`;
const SHOPIFY_ONLINE_TOKEN_PREFIX = 'SHOPIFY_ONLINE_ACCESS_TOKEN:user:';

export class ShopifyAuthError extends Error {}

export type TokenCandidate = { token: string; source: string };

export function getShopifyTokenCandidates(userId: string): TokenCandidate[] {
  const env = process.env as Record<string, string | undefined>;
  const candidates: TokenCandidate[] = [];
  const add = (token: string | undefined | null, source: string) => {
    if (!token || candidates.some((c) => c.token === token)) return;
    candidates.push({ token, source });
  };

  // Prefer a permanent Admin API token; connector tokens can be revoked.
  add(env['SHOPIFY_ADMIN_API_ACCESS_TOKEN'], 'admin-api');
  add(env['SHOPIFY_ADMIN_ACCESS_TOKEN'], 'admin');
  add(env[`${SHOPIFY_ONLINE_TOKEN_PREFIX}${userId}`], 'exact-online');

  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith(SHOPIFY_ONLINE_TOKEN_PREFIX)) add(value, 'connector-online');
  }

  add(env['SHOPIFY_ACCESS_TOKEN'], 'static');
  return candidates;
}

// Dev Dashboard apps don't expose a copyable shpat_ token; mint a short-lived
// Admin API token via the client credentials grant instead.
let mintedToken: { token: string; expiresAt: number } | null = null;

export async function mintClientCredentialsToken(): Promise<string | null> {
  if (mintedToken && mintedToken.expiresAt > Date.now() + 60_000) return mintedToken.token;
  const clientId = process.env['SHOPIFY_CLIENT_ID'];
  const clientSecret = process.env['SHOPIFY_CLIENT_SECRET'];
  if (!clientId || !clientSecret) {
    console.error('[shopify] client credentials missing', { hasId: !!clientId, hasSecret: !!clientSecret });
    return null;
  }
  try {
    const res = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });
    if (!res.ok) {
      console.error('[shopify] client credentials grant failed', res.status);
      return null;
    }
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) return null;
    mintedToken = {
      token: json.access_token,
      expiresAt: Date.now() + (json.expires_in ?? 86399) * 1000,
    };
    return mintedToken.token;
  } catch (error) {
    console.error('[shopify] client credentials grant error', error);
    return null;
  }
}

/** Async candidate list with the minted client-credentials token first. */
export async function getShopifyTokens(userId: string): Promise<TokenCandidate[]> {
  const candidates = getShopifyTokenCandidates(userId);
  const minted = await mintClientCredentialsToken();
  if (minted && !candidates.some((c) => c.token === minted)) {
    candidates.unshift({ token: minted, source: 'client-credentials' });
  }
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

export async function shopifyWithFallback(
  path: string,
  candidates: TokenCandidate[],
  init: RequestInit = {},
) {
  let authFailures = 0;
  for (const candidate of candidates) {
    try {
      return await shopify(path, candidate.token, candidate.source, init);
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

export type DiscountAction =
  | { action: 'list' }
  | { action: 'create'; rule: Record<string, unknown>; code?: string }
  | { action: 'update'; price_rule_id: number; rule: Record<string, unknown> }
  | { action: 'disable'; price_rule_id: number }
  | { action: 'delete'; price_rule_id: number };

export async function runDiscountAction(input: DiscountAction, userId: string) {
  const tokens = await getShopifyTokens(userId);
  if (tokens.length === 0) {
    throw new ShopifyAuthError('No Shopify Admin API access token available. Add a valid Shopify Admin API access token for this store and try again.');
  }

  switch (input.action) {
    case 'list': {
      const rules = await shopifyWithFallback('/price_rules.json?limit=100', tokens);
      const enriched = await Promise.all(
        (rules.price_rules || []).map(async (r: any) => {
          try {
            const codes = await shopifyWithFallback(`/price_rules/${r.id}/discount_codes.json`, tokens);
            return { ...r, discount_codes: codes.discount_codes || [] };
          } catch {
            return { ...r, discount_codes: [] };
          }
        }),
      );
      return { rules: enriched };
    }
    case 'create': {
      const created = await shopifyWithFallback('/price_rules.json', tokens, {
        method: 'POST',
        body: JSON.stringify({ price_rule: input.rule }),
      });
      const ruleId = created.price_rule.id;
      if (input.code) {
        await shopifyWithFallback(`/price_rules/${ruleId}/discount_codes.json`, tokens, {
          method: 'POST',
          body: JSON.stringify({ discount_code: { code: input.code } }),
        });
      }
      return { ok: true, price_rule: created.price_rule };
    }
    case 'update': {
      const updated = await shopifyWithFallback(`/price_rules/${input.price_rule_id}.json`, tokens, {
        method: 'PUT',
        body: JSON.stringify({ price_rule: { id: input.price_rule_id, ...input.rule } }),
      });
      return { ok: true, price_rule: updated.price_rule };
    }
    case 'disable': {
      const updated = await shopifyWithFallback(`/price_rules/${input.price_rule_id}.json`, tokens, {
        method: 'PUT',
        body: JSON.stringify({ price_rule: { id: input.price_rule_id, ends_at: new Date().toISOString() } }),
      });
      return { ok: true, price_rule: updated.price_rule };
    }
    case 'delete': {
      await shopifyWithFallback(`/price_rules/${input.price_rule_id}.json`, tokens, { method: 'DELETE' });
      return { ok: true };
    }
    default:
      throw new Error('Unknown action');
  }
}
