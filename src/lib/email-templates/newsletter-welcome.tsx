import * as React from 'react'
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
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'PLÄNTLY'

const NewsletterWelcomeEmail = () => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Välkommen till {SITE_NAME} — 10% rabatt på din första beställning</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandHeader}>
          <Heading style={brand}>{SITE_NAME}</Heading>
        </Section>
        <Section style={card}>
          <Heading style={h2}>Välkommen till PLÄNTLY</Heading>
          <Text style={text}>
            Tack för att du prenumererar! Du får nu exklusiva erbjudanden, nya
            recept och 10% rabatt på din första beställning.
          </Text>
          <Text style={textMuted}>
            Welcome to PLÄNTLY! You&apos;ll receive exclusive offers, new
            recipes, and 10% off your first order.
          </Text>
          <Button href="https://plaently.com/products" style={button}>
            Handla nu
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewsletterWelcomeEmail,
  subject: 'Välkommen till PLÄNTLY',
  displayName: 'Newsletter welcome',
  previewData: {},
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
