import { createFileRoute } from '@tanstack/react-router'

// Sends the Starter Pack offer code to a newsletter subscriber.
// Public trigger: the caller must already exist in newsletter_subscribers,
// which is the same gate the legacy send function enforced.
export const Route = createFileRoute('/api/public/starter-offer-email')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let email: string
        let code: string
        try {
          const body = (await request.json()) as { email?: string; code?: string }
          email = (body.email ?? '').trim().toLowerCase()
          code = (body.code ?? '').trim()
        } catch {
          return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !code) {
          return Response.json({ error: 'email and code are required' }, { status: 400 })
        }

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
        const { data: subscriber, error: subError } = await supabaseAdmin
          .from('newsletter_subscribers')
          .select('email')
          .eq('email', email)
          .maybeSingle()

        if (subError) {
          console.error('Subscriber lookup failed', { error: subError })
          return Response.json({ error: 'Lookup failed' }, { status: 500 })
        }
        if (!subscriber) {
          return Response.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
        const { logEmailSend } = await import('@/lib/email-send-log.server')

        try {
          const result = await sendTemplateEmail('starter-offer-code', email, {
            templateData: { code },
            idempotencyKey: `starter-offer-code-${email}`,
          })
          if (!result.sent) {
            await logEmailSend({
              templateName: 'starter-offer-code',
              recipientEmail: email,
              status: 'suppressed',
            })
            return Response.json({ success: false, reason: result.reason })
          }
          await logEmailSend({
            templateName: 'starter-offer-code',
            recipientEmail: email,
            status: 'sent',
          })
          return Response.json({ success: true })
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          console.error('Starter offer email failed', { message })
          await logEmailSend({
            templateName: 'starter-offer-code',
            recipientEmail: email,
            status: 'failed',
            errorMessage: message,
          })
          return Response.json({ error: 'Failed to send email' }, { status: 500 })
        }
      },
    },
  },
})
