// Server-only logic for the one-time 199 kr Starter Pack offer.
// SECURITY: everything about the discount (50%, Starter Pack only, 1 use,
// once per customer, allocation_limit 1) is hardcoded here. The only value
// that comes from the browser is the email address.
import { getShopifyTokenCandidates, shopifyWithFallback } from './shopifyDiscounts.server';

export const STARTER_OFFER_LIMIT = 500;
const STARTER_PACK_HANDLES = ['starter-pack-12-cups-1', 'starter-pack-12-cups'];

const RATE_LIMIT_HOURLY = 5;
const RATE_LIMIT_DAILY = 10;

export type StarterOfferResult =
  | { status: 'issued'; code: string; issued: number; limit: number }
  | { status: 'already_claimed'; code: string | null; issued: number; limit: number }
  | { status: 'sold_out'; issued: number; limit: number }
  | { status: 'invalid_email' }
  | { status: 'rate_limited' }
  | { status: 'error'; message: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 255 && EMAIL_RE.test(value);
}

export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`starter-offer:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `STARTER-${out}`;
}

async function findStarterPackProductId(tokens: TokenCandidate[]): Promise<number | null> {
  for (const handle of STARTER_PACK_HANDLES) {
    try {
      const res = await shopifyWithFallback(
        `/products.json?handle=${encodeURIComponent(handle)}&fields=id,handle&limit=1`,
        tokens,
      );
      const product = res?.products?.[0];
      if (product?.id) return product.id as number;
    } catch (error) {
      console.error('[starter-offer] product lookup failed', error);
    }
  }
  return null;
}

export async function issueStarterOffer(rawEmail: string, ip: string, market: 'SE' | 'EU'): Promise<StarterOfferResult> {
  const email = rawEmail.trim().toLowerCase();
  if (!isValidEmail(email)) return { status: 'invalid_email' };

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

  // 1. Rate limit per IP before anything else.
  const ipHash = await hashIp(ip || 'unknown');
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: attempts } = await supabaseAdmin
    .from('starter_pack_offer_attempts')
    .select('created_at')
    .eq('ip_hash', ipHash)
    .gte('created_at', dayAgo);

  const recent = attempts ?? [];
  const lastHour = recent.filter((a) => a.created_at >= hourAgo).length;
  if (recent.length >= RATE_LIMIT_DAILY || lastHour >= RATE_LIMIT_HOURLY) {
    return { status: 'rate_limited' };
  }
  await supabaseAdmin.from('starter_pack_offer_attempts').insert({ ip_hash: ipHash });

  // 2. Already claimed?
  const { data: existing } = await supabaseAdmin
    .from('starter_pack_offer_codes')
    .select('code')
    .eq('email', email)
    .maybeSingle();

  const countIssued = async () => {
    const { count } = await supabaseAdmin
      .from('starter_pack_offer_codes')
      .select('id', { count: 'exact', head: true });
    return count ?? 0;
  };

  if (existing) {
    return { status: 'already_claimed', code: existing.code, issued: await countIssued(), limit: STARTER_OFFER_LIMIT };
  }

  // 3. Cap reached?
  const issued = await countIssued();
  if (issued >= STARTER_OFFER_LIMIT) {
    return { status: 'sold_out', issued, limit: STARTER_OFFER_LIMIT };
  }

  // 4. Create the Shopify price rule + discount code (all values hardcoded).
  const tokens = getShopifyTokenCandidates('starter-offer');
  if (tokens.length === 0) {
    console.error('[starter-offer] no Shopify admin token available');
    return { status: 'error', message: 'shopify_unavailable' };
  }

  const productId = await findStarterPackProductId(tokens);
  if (!productId) {
    console.error('[starter-offer] Starter Pack product not found');
    return { status: 'error', message: 'product_not_found' };
  }

  const code = generateCode();
  try {
    const created = await shopifyWithFallback('/price_rules.json', tokens, {
      method: 'POST',
      body: JSON.stringify({
        price_rule: {
          title: code,
          target_type: 'line_item',
          target_selection: 'entitled',
          allocation_method: 'each',
          allocation_limit: 1,
          value_type: 'percentage',
          value: '-50.0',
          customer_selection: 'all',
          entitled_product_ids: [productId],
          once_per_customer: true,
          usage_limit: 1,
          starts_at: new Date().toISOString(),
        },
      }),
    });

    const priceRuleId = created?.price_rule?.id;
    const codeRes = await shopifyWithFallback(`/price_rules/${priceRuleId}/discount_codes.json`, tokens, {
      method: 'POST',
      body: JSON.stringify({ discount_code: { code } }),
    });

    const { error: insertError } = await supabaseAdmin.from('starter_pack_offer_codes').insert({
      email,
      code,
      shopify_price_rule_id: priceRuleId ? String(priceRuleId) : null,
      shopify_discount_code_id: codeRes?.discount_code?.id ? String(codeRes.discount_code.id) : null,
      market,
    });

    if (insertError) {
      // Unique violation → another request won the race for this email.
      if (insertError.code === '23505') {
        const { data: winner } = await supabaseAdmin
          .from('starter_pack_offer_codes')
          .select('code')
          .eq('email', email)
          .maybeSingle();
        return {
          status: 'already_claimed',
          code: winner?.code ?? null,
          issued: await countIssued(),
          limit: STARTER_OFFER_LIMIT,
        };
      }
      throw insertError;
    }

    return { status: 'issued', code, issued: await countIssued(), limit: STARTER_OFFER_LIMIT };
  } catch (error) {
    console.error('[starter-offer] failed to create discount', error);
    return { status: 'error', message: 'discount_creation_failed' };
  }
}

export async function getIssuedCount(): Promise<{ issued: number; limit: number }> {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { count } = await supabaseAdmin
    .from('starter_pack_offer_codes')
    .select('id', { count: 'exact', head: true });
  return { issued: count ?? 0, limit: STARTER_OFFER_LIMIT };
}
