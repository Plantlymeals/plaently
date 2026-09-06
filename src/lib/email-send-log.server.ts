// Server-only helper that mirrors the legacy queue's app-table bookkeeping:
// every managed send records an append-only row in email_send_log.
import { supabaseAdmin } from '@/integrations/supabase/client.server'

type SendLogStatus = 'sent' | 'suppressed' | 'failed'

export async function logEmailSend(params: {
  templateName: string
  recipientEmail: string
  status: SendLogStatus
  errorMessage?: string
}): Promise<void> {
  const { error } = await supabaseAdmin.from('email_send_log').insert({
    message_id: null,
    template_name: params.templateName,
    recipient_email: params.recipientEmail,
    status: params.status,
    ...(params.errorMessage ? { error_message: params.errorMessage.slice(0, 1000) } : {}),
  })

  if (error) {
    console.error('Failed to write email_send_log row', {
      template: params.templateName,
      status: params.status,
      error,
    })
  }
}
