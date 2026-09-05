import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'PLÄNTLY'

const StarterOfferCodeEmail = ({ code = 'STARTER-XXXXXX' }: { code?: string }) => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Din personliga kod: Starter Pack för 199 kr</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandHeader}>
          <Heading style={brand}>{SITE_NAME}</Heading>
        </Section>
        <Section style={card}>
          <Heading style={h2}>Starter Pack för 199 kr</Heading>
          <Text style={text}>
            Här är din personliga engångskod. Den gäller för ett (1) Starter
            Pack — 12 koppar, mixa dina smaker — och kan bara användas en gång.
          </Text>
          <Text style={codeStyle}>{code}</Text>
          <Text style={textMuted}>
            Your personal one-time code for a Starter Pack at 199 kr (approx.
            17,90 €). Valid for one order only.
          </Text>
          <Button href="https://plaently.com/product/starter-pack-12-cups-1" style={button}>
            Använd koden
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: StarterOfferCodeEmail,
  subject: 'Din kod: Starter Pack för 199 kr',
  displayName: 'Starter Pack offer code',
  previewData: { code: 'STARTER-AB12CD' },
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
  textAlign: 'center' as const,
}
const h2 = { color: '#141414', fontSize: '22px', margin: '0 0 12px' }
const text = {
  color: '#3a3a3a',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}
const codeStyle = {
  display: 'inline-block',
  backgroundColor: '#ffffff',
  border: '2px dashed #5a8a2e',
  borderRadius: '12px',
  padding: '14px 24px',
  fontSize: '20px',
  fontWeight: 700,
  letterSpacing: '1px',
  color: '#2f4a18',
  margin: '0 0 16px',
}
const textMuted = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const button = {
  backgroundColor: '#5a8a2e',
  color: '#ffffff',
  padding: '14px 32px',
  borderRadius: '999px',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '15px',
  display: 'inline-block',
}
