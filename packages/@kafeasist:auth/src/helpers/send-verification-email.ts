import { sendEmail, VerifyEmail } from "@kafeasist/email";

import { createToken } from "./create-token";

export async function sendVerificationEmail(email: string) {
  const token = createToken({ email });

  try {
    await sendEmail(
      [email],
      "kafeasist hesabın oluşturuldu!",
      VerifyEmail({ token }),
    );
  } catch (error: unknown) {
    console.error(error);
  }
}
