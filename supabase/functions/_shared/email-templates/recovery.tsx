/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Återställ ditt lösenord för PLÄNTLY</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://fpwwjbevjhxbggtkaabc.supabase.co/storage/v1/object/public/email-assets/logo.png" alt="PLÄNTLY" height="28" style={logo} />
        <Heading style={h1}>Återställ ditt lösenord</Heading>
        <Text style={text}>
          Vi fick en begäran om att återställa ditt lösenord. Klicka på knappen nedan för att välja ett nytt lösenord.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Återställ lösenord
        </Button>
        <Text style={footer}>
          Om du inte begärde en lösenordsåterställning kan du ignorera det här meddelandet.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Poppins', Arial, sans-serif" }
const container = { padding: '40px 25px' }
const logo = { margin: '0 0 24px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#141414',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#666666',
  lineHeight: '1.6',
  margin: '0 0 25px',
}
const button = {
  backgroundColor: 'hsl(100, 48%, 45%)',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600' as const,
  borderRadius: '12px',
  padding: '12px 24px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
