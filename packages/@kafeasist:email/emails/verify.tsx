import * as React from "react";
import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

const baseUrl = process.env.URL || "https://kafeasist.com";

interface VerifyEmailProps {
  token: string;
}

export const VerifyEmail = ({ token }: VerifyEmailProps) => (
  <Html>
    <Preview>kafeasist hesabın başarıyla oluşturuldu</Preview>
    <Container style={{ ...container, ...main }}>
      <Img
        src={`${baseUrl}/logo/logo_light.svg`}
        width="70"
        height="70"
        alt="kafeasist Logo"
        style={logo}
      />
      <Text style={paragraph}>Merhaba,</Text>
      <Text style={paragraph}>
        kafeasist hesabın başarıyla oluşturuldu. Hesabını aktifleştirmek için
        aşağıdaki butona tıkla.
      </Text>
      <Section style={btnContainer}>
        <Button style={button} href={`${baseUrl}/dogrula?token=${token}`}>
          Hesabımı aktifleştir
        </Button>
      </Section>
      <Text style={paragraph}>
        kafeasist ailesine hoş geldin. Hesabını aktifleştirdikten sonra
        kafeasist ile işletmeni yönetmeye başlayabilirsin.
      </Text>
      <Text style={paragraph}>
        Saygılarımızla,
        <br />
        kafeasist ekibi.
      </Text>
    </Container>
  </Html>
);

const main = {
  padding: "3rem",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "12px",
  color: "#eeeeee",
  fontSize: "14px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 20px",
};
