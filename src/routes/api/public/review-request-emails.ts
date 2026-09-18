import { createFileRoute } from '@tanstack/react-router'

// Processes due post-purchase review requests and sends them through
// Lovable-managed email delivery. Called by cron; the caller must present the
// internal secret.
const SHOPIFY_STORE_DOMAIN = 'plantly-website-cms-fyvdr.myshopify.com'
const SHOPIFY_ADMIN_API = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-07`
const REVIEW_PRICE_RULE_FALLBACK = '1905603477830'
const MAX_ATTEMPTS = 3
const BATCH_SIZE = 25

function randomCodeSuffix(len = 8): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const buf = new Uint8Array(len)
  crypto.getRandomValues(buf)
  let out = ''
  for (let i = 0; i < len; i++) out += alphabet[buf[i] % alphabet.length]
  return out
}

async function getAdminToken(): Promise<string | null> {
  const clientId = process.env['SHOPIFY_CLIENT_ID']
  const clientSecret = process.env['SHOPIFY_CLIENT_SECRET']
  if (clientId && clientSecret) {
    const res = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    })
    if (res.ok) {
      const data = (await res.json()) as { access_token?: string }
      if (data.access_token) return data.access_token
    } else {
      console.error('Shopify client_credentials failed', res.status)
    }
  }
  return process.env['SHOPIFY_ADMIN_API_ACCESS_TOKEN'] ?? process.env['SHOPIFY_ACCESS_TOKEN'] ?? null
}

async function mintDiscountCode(
  priceRuleId: string,
  code: string,
  token: string,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${SHOPIFY_ADMIN_API}/price_rules/${priceRuleId}/discount_codes.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ discount_code: { code } }),
  })
  if (!res.ok) {
    const text = await res.text()
    return { ok: false, error: `Shopify ${res.status}: ${text.slice(0, 300)}` }
  }
  return { ok: true }
}

export const Route = createFileRoute('/api/public/review-request-emails')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const provided = request.headers.get('x-internal-secret') ?? ''
        const expected = process.env['INTERNAL_WEBHOOK_SECRET'] ?? ''
        if (!expected || provided !== expected) {
          return new Response('Unauthorized', { status: 401 })
        }

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
        const { data: due, error } = await supabaseAdmin
          .from('review_requests')
          .select('*')
          .eq('status', 'scheduled')
          .lte('send_at', new Date().toISOString())
          .lt('attempts', MAX_ATTEMPTS)
          .order('send_at', { ascending: true })
          .limit(BATCH_SIZE)

        if (error) return Response.json({ error: error.message }, { status: 500 })
        if (!due || due.length === 0) return Response.json({ ok: true, processed: 0 })

        const envRuleId = process.env['SHOPIFY_REVIEW_PRICE_RULE_ID']
        const priceRuleId =
          envRuleId && /^\d+$/.test(envRuleId) ? envRuleId : REVIEW_PRICE_RULE_FALLBACK
        const token = await getAdminToken()
        if (!token) return Response.json({ error: 'Shopify token unavailable' }, { status: 500 })

        const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
        const { logEmailSend } = await import('@/lib/email-send-log.server')

        let sent = 0
        let failed = 0
        let skipped = 0

        for (const row of due as any[]) {
          const attempts = (row.attempts ?? 0) + 1
          const fail = async (message: string) => {
            await supabaseAdmin
              .from('review_requests')
              .update({
                attempts,
                status: attempts >= MAX_ATTEMPTS ? 'failed' : 'scheduled',
                error: message.slice(0, 500),
              })
              .eq('id', row.id)
            failed++
          }

          let code: string = row.discount_code ?? `PLANTLY-REVIEW-${randomCodeSuffix(8)}`
          if (!row.discount_code) {
            const mint = await mintDiscountCode(priceRuleId, code, token)
            if (!mint.ok) {
              await fail(mint.error ?? 'discount_mint_failed')
              continue
            }
            await supabaseAdmin
              .from('review_requests')
              .update({ discount_code: code })
              .eq('id', row.id)
          }

          const items = Array.isArray(row.line_items) ? (row.line_items as any[]) : []
          const first = items[0] ?? null
          const firstName = (row.customer_name ?? '').split(' ')[0] || null

          try {
            const result = await sendTemplateEmail('review-request', row.customer_email, {
              templateData: {
                firstName,
                productTitle: first?.title ?? null,
                productHandle: first?.handle ?? null,
                code,
              },
              idempotencyKey: `review-request-${row.id}`,
            })
            if (!result.sent) {
              await logEmailSend({
                templateName: 'review-request',
                recipientEmail: row.customer_email,
                status: 'suppressed',
              })
              await supabaseAdmin
                .from('review_requests')
                .update({
                  status: 'skipped',
                  attempts,
                  error: result.reason,
                  sent_at: new Date().toISOString(),
                })
                .eq('id', row.id)
              skipped++
              continue
            }
            await logEmailSend({
              templateName: 'review-request',
              recipientEmail: row.customer_email,
              status: 'sent',
            })
            await supabaseAdmin
              .from('review_requests')
              .update({
                status: 'sent',
                sent_at: new Date().toISOString(),
                attempts,
                error: null,
              })
              .eq('id', row.id)
            sent++
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e)
            await logEmailSend({
              templateName: 'review-request',
              recipientEmail: row.customer_email,
              status: 'failed',
              errorMessage: message,
            })
            await fail(message)
          }
        }

        return Response.json({ ok: true, processed: due.length, sent, failed, skipped })
      },
    },
  },
})
