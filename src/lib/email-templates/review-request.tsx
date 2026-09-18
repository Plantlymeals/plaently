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
const SITE_ORIGIN = 'https://www.plaently.com'

interface ReviewRequestData {
  firstName?: string | null
  productTitle?: string | null
  productHandle?: string | null
  code?: string
}

const ReviewRequestEmail = ({
  firstName = null,
  productTitle = null,
  productHandle = null,
  code = 'PLANTLY-REVIEW-XXXXXXXX',
}: ReviewRequestData) => {
  const reviewUrl = productHandle
    ? `${SITE_ORIGIN}/product/${productHandle}?review=1#reviews`
    : `${SITE_ORIGIN}/products`
  return (
    <Html lang="sv" dir="ltr">
      <Head />
      <Preview>Hur smakade måltiderna? Lämna gärna ett omdöme</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandHeader}>
            <Heading style={brand}>{SITE_NAME}</Heading>
          </Section>
          <Section style={card}>
            <Heading style={h2}>
              {firstName ? `Hur smakade måltiderna, ${firstName}?` : 'Hur smakade måltiderna?'}
            </Heading>
            <Text style={text}>
              Tack för din beställning. Vi hoppas varje kopp satte guldkant på dagen –
              växtbaserat protein, fiberrikt och klart på 3 minuter.
            </Text>
            <Text style={text}>
              Vill du dela ett kort och ärligt omdöme{productTitle ? ` om ${productTitle}` : ''}?
              Det hjälper andra att veta vad de kan förvänta sig.
            </Text>
            <Button href={reviewUrl} style={button}>
              Lämna ett omdöme
            </Button>
            <Text style={textMuted}>Som tack: 10 % rabatt på din nästa beställning.</Text>
            <Text style={codeStyle}>{code}</Text>
            <Text style={textMuted}>
              Engångskod. Ditt omdöme är lika välkommet oavsett – koden är din hur du än tycker.
              Omdömen granskas innan de publiceras.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ReviewRequestEmail,
  subject: (data: Record<string, any>) =>
    data?.['firstName']
      ? `Hur smakade måltiderna, ${data['firstName']}?`
      : 'Hur smakade måltiderna?',
  displayName: 'Review request',
  previewData: {
    firstName: 'Ahmet',
    productTitle: 'Starter Pack',
    productHandle: 'starter-pack',
    code: 'PLANTLY-REVIEW-AB12CD34',
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
  margin: '16px 0 8px',
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
