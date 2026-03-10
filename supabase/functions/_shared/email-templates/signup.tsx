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
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Bekräfta din e-post för PLÄNTLY</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://fpwwjbevjhxbggtkaabc.supabase.co/storage/v1/object/public/email-assets/logo.png" alt="PLÄNTLY" height="28" style={logo} />
        <Heading style={h1}>Välkommen till PLÄNTLY!</Heading>
        <Text style={text}>
          Tack för att du registrerade dig. Bekräfta din e-postadress ({recipient}) genom att klicka på knappen nedan:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Bekräfta e-post
        </Button>
        <Text style={footer}>
          Om du inte skapade något konto kan du ignorera det här meddelandet.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

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
