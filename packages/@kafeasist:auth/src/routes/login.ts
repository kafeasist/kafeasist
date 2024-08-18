import { verify } from "argon2";
import { TOTP } from "otpauth";

import { prisma } from "@kafeasist/db";
import { Cache, invalidateCache } from "@kafeasist/redis";

import { createToken } from "../helpers/create-token";
import { AuthResponse } from "../types/AuthResponse";
import { Session } from "../types/Session";

interface LoginParams {
  email: string;
  password: string;
  pin?: string;
}

export const login = async (
  params: LoginParams,
): Promise<AuthResponse<LoginParams>> => {
  const { email, password } = params;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user)
    return {
      success: false,
      message: "E-posta veya şifre hatalı",
      fields: ["email", "password"],
    };

  if (!(await verify(user.password, password)))
    return {
      success: false,
      message: "E-posta veya şifre hatalı",
      fields: ["email", "password"],
    };

  if (user.twoFA && !params.pin)
    return {
      success: false,
      message: "REDIRECT_TO_2FA", // Special case for 2FA
      fields: ["pin"],
    };

  if (user.twoFA && params.pin) {
    const totp = new TOTP({
      issuer: "kafeasist",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      secret: user.twoFASecret!,
    });

    const isValid = totp.validate({ token: params.pin });

    if (isValid == null)
      return {
        success: false,
        message: "Girdiğiniz kimlik doğrulama kodu hatalı.",
        fields: ["pin"],
      };
  }

  const session: Session = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    imageUrl: user.imageUrl,
    emailVerified: user.emailVerified,
    twoFA: user.twoFA,
  };

  const jwt = createToken({ id: user.id });
  await invalidateCache(Cache.COMPANY + user.id);

  return {
    success: true,
    token: jwt,
    session,
  };
};
