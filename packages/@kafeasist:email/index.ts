import React from "react";

import { reportError } from "@kafeasist/error";

import { resend } from "./lib/resend";

export { ForgotPasswordEmail } from "./emails/forgot-password";
export { VerifyEmail } from "./emails/verify";
export { VerifyThanksEmail } from "./emails/verify-thanks";

export async function sendEmail(
  to: string[],
  subject: string,
  react: React.JSX.Element,
) {
  const { data, error } = await resend.emails.send({
    from: "team@kafeasist.com",
    to,
    subject,
    react,
  });

  if (error) {
    console.error(error);
    const sentryReportId = reportError(error);

    console.error(`>>> E-mail error occured: ${sentryReportId}`);
    throw new Error("E-posta gönderilirken bir hata oluştu.");
  }

  if (data) return data.id;

  throw new Error("E-posta ID'si alınamadı.");
}
