import * as React from "react";
import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

const baseUrl = process.env.URL || "https://kafeasist.com";

export const VerifyThanksEmail = () => (
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
        Hesabının e-postası başarıyla doğrulandı. Artık kafeasist hesabını doya
        doya kullanabilirsin. Hesabını kullanmaya başlamak için aşağıdaki butona
        tıkla.
      </Text>
      <Section style={btnContainer}>
        <Button style={button} href={`${baseUrl}/panel`}>
          Hesabımı kullanmaya başla
        </Button>
      </Section>
      <Text style={paragraph}>
        Hesabını kullanmaya başlamadan önce hesabını tamamen güvenli hale
        getirmek için iki adımlı doğrulamayı aktif etmeni öneririz. İki adımlı
        doğrulama hesabınızın güvenliğini arttırır ve hesabınızın başkaları
        tarafından ele geçirilmesini engeller.
      </Text>
      <Text style={paragraph}>
        kafeasist hesabını doğruladığın için çok teşekkür ederiz. İşletmenizi
        güvenle yönetmeniz dileğiyle.
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
