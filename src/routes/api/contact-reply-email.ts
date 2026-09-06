import { createFileRoute } from '@tanstack/react-router'

// Sends an admin reply to a contact submission. Admin-only: the caller must
// present a Supabase access token belonging to a user with the admin role.
export const Route = createFileRoute('/api/contact-reply-email')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get('Authorization') ?? ''
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
        if (!token) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let recipientEmail: string
        let recipientName: string
        let replyBody: string
        let originalMessage: string
        let idempotencyKey: string | undefined
        try {
          const body = (await request.json()) as Record<string, string | undefined>
          recipientEmail = (body['recipientEmail'] ?? '').trim()
          recipientName = body['recipientName'] ?? ''
          replyBody = body['replyBody'] ?? ''
          originalMessage = body['originalMessage'] ?? ''
          idempotencyKey = body['idempotencyKey']
        } catch {
          return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
        }

        if (!recipientEmail || !replyBody) {
          return Response.json(
            { error: 'recipientEmail and replyBody are required' },
            { status: 400 },
          )
        }

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
        const userId = userData?.user?.id
        if (userError || !userId) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
          _user_id: userId,
          _role: 'admin',
        })
        if (roleError || !isAdmin) {
          return Response.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
        const { logEmailSend } = await import('@/lib/email-send-log.server')

        try {
          const result = await sendTemplateEmail('contact-reply', recipientEmail, {
            templateData: { recipientName, replyBody, originalMessage },
            ...(idempotencyKey ? { idempotencyKey: `contact-reply-${idempotencyKey}` } : {}),
          })
          if (!result.sent) {
            await logEmailSend({
              templateName: 'contact-reply',
              recipientEmail,
              status: 'suppressed',
            })
            return Response.json({ success: false, reason: result.reason })
          }
          await logEmailSend({
            templateName: 'contact-reply',
            recipientEmail,
            status: 'sent',
          })
          return Response.json({ success: true })
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          console.error('Contact reply email failed', { message })
          await logEmailSend({
            templateName: 'contact-reply',
            recipientEmail,
            status: 'failed',
            errorMessage: message,
          })
          return Response.json({ error: 'Failed to send email' }, { status: 500 })
        }
      },
    },
  },
})
