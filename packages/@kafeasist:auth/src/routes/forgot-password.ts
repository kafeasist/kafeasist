import { hash } from "argon2";
import { sign, verify } from "jsonwebtoken";

import { prisma } from "@kafeasist/db";
import { ForgotPasswordEmail, sendEmail } from "@kafeasist/email";

import { JWT_SECRET, JWT_SIGNING_OPTIONS } from "../config";
import { decodeJwt } from "../helpers/decode-jwt";
import { validateEmail, validatePassword } from "../helpers/validators";
import { AuthResponse } from "../types/AuthResponse";
import { Session } from "../types/Session";

interface ForgotPasswordParams {
  email: string;
}

/**
 * Forgot password
 * @param type
 * @param params
 * @returns AuthResponse
 */
export const forgotPassword = async (
  params: ForgotPasswordParams,
): Promise<AuthResponse<typeof params>> => {
  const { email } = params;

  try {
    validateEmail(email);
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        message: error.message,
        fields: ["email"] as any,
      };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  const EMAIL_ERROR = "E-posta gönderilirken bir hata ile karşılaşıldı.";

  if (user) {
    const token = sign({ id: user.id }, JWT_SECRET, JWT_SIGNING_OPTIONS);

    const result = await sendEmail(
      [user.email],
      "kafeasist şifreni sıfırla!",
      ForgotPasswordEmail({ token }),
    );

    if (!result) {
      return {
        success: false,
        message: EMAIL_ERROR,
        fields: ["email"] as any,
      };
    }
  }

  return {
    success: true,
    token: "",
    session: {} as Session,
  };
};

interface ResetPasswordParams {
  token: string;
  password: string;
  confirmPassword: string;
}

export const resetPassword = async (
  params: ResetPasswordParams,
): Promise<AuthResponse<typeof params>> => {
  const { token } = params;

  try {
    if (!verify(token, JWT_SECRET)) {
      return {
        success: false,
        message: "Bağlantınızın süresi geçmiş olabilir. Lütfen tekrar deneyin.",
        fields: [],
      };
    }

    const { id } = decodeJwt(token) as { id: number };

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return {
        success: false,
        message: "Kullanıcı alınırken bir hata ile karşılaşıldı.",
        fields: [],
      };
    }

    const { password, confirmPassword } = params;

    if (password !== confirmPassword)
      return {
        success: false,
        message: "Girilen şifreler birbiriyle uyuşmuyor",
        fields: ["password", "confirmPassword"],
      };

    try {
      validatePassword(password);
    } catch (error: unknown) {
      if (error instanceof Error)
        return {
          success: false,
          message: error.message,
          fields: ["password"],
        };
    }

    if (password !== user.password) {
      const hashedPassword = await hash(password);

      try {
        await prisma.user.update({
          where: { id },
          data: { password: hashedPassword },
        });
      } catch (error: unknown) {
        if (error instanceof Error)
          return {
            success: false,
            message: error.message,
            fields: [],
          };
      }
    }

    return {
      success: true,
      token,
      session: user,
    };
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        message: error.message,
        fields: [] as any,
      };
  }

  return {
    success: false,
    message: "Bir haya oluştu. Lütfen tekrar deneyin.",
    fields: [],
  };
};
