import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'PLÄNTLY'

interface ReplyProps {
  recipientName?: string
  replyBody?: string
  originalMessage?: string
}

const ContactReplyEmail = ({
  recipientName = '',
  replyBody = '',
  originalMessage = '',
}: ReplyProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reply from {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandHeader}>
          <Heading style={brand}>{SITE_NAME}</Heading>
        </Section>
        <Section style={card}>
          {recipientName ? <Text style={text}>Hej {recipientName},</Text> : null}
          {replyBody.split(/\n+/).map((p, i) => (
            <Text key={i} style={text}>{p}</Text>
          ))}
          <Text style={signature}>— PLÄNTLY team</Text>
          {originalMessage ? (
            <Section style={quoteBox}>
              <Text style={quoteLabel}>Your original message:</Text>
              <Text style={quote}>{originalMessage}</Text>
            </Section>
          ) : null}
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactReplyEmail,
  subject: 'Reply from PLÄNTLY',
  displayName: 'Contact reply',
  previewData: {
    recipientName: 'Anna',
    replyBody: 'Thanks for reaching out! Here is the info you asked for…',
    originalMessage: 'Hi, do you ship to Norway?',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Poppins', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
}
const container = { maxWidth: '560px', margin: '0 auto', padding: '40px 24px' }
const brandHeader = { textAlign: 'center' as const, marginBottom: '24px' }
const brand = { color: '#5a8a2e', fontSize: '28px', margin: 0 }
const card = {
  backgroundColor: '#f6faf0',
  borderRadius: '16px',
  padding: '32px 24px',
}
const text = {
  color: '#3a3a3a',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 14px',
}
const signature = {
  color: '#3a3a3a',
  fontSize: '15px',
  margin: '24px 0 0',
  fontWeight: 600,
}
const quoteBox = {
  borderLeft: '3px solid #d6e4c2',
  paddingLeft: '12px',
  marginTop: '32px',
}
const quoteLabel = {
  color: '#888',
  fontSize: '12px',
  margin: '0 0 6px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}
const quote = {
  color: '#666',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: 0,
  fontStyle: 'italic' as const,
}
