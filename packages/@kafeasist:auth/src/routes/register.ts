import { hash } from "argon2";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "@kafeasist/db";
import { sendEmail, VerifyEmail } from "@kafeasist/email";
import { Cache, invalidateCache } from "@kafeasist/redis";

import { createToken } from "../helpers/create-token";
import { getPayloadFromJWT } from "../helpers/get-payload-from-jwt";
import {
  validateEmail,
  validateNameLastName,
  validatePassword,
  validatePhone,
} from "../helpers/validators";
import { AuthResponse } from "../types/AuthResponse";
import { Session } from "../types/Session";

interface RegisterParams {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const register = async (
  params: RegisterParams,
): Promise<AuthResponse<RegisterParams>> => {
  const { email } = params;

  try {
    validateEmail(email);
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        message: error.message,
        fields: ["email"],
      };
  }

  if (await prisma.user.findUnique({ where: { email } }))
    return {
      success: false,
      message: "Bu e-posta adresi zaten kullanımda",
      fields: ["email"],
    };

  const { firstName, lastName } = params;

  try {
    validateNameLastName(firstName, lastName);
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        message: error.message,
        fields: ["firstName", "lastName"],
      };
  }

  const { phone } = params;

  try {
    validatePhone(phone);
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        message: error.message,
        fields: ["phone"],
      };
  }

  if (await prisma.user.findUnique({ where: { phone } })) {
    return {
      success: false,
      message: "Bu telefon numarası zaten kullanımda",
      fields: ["phone"],
    };
  }

  const { password } = params;

  try {
    validatePassword(password);
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        success: false,
        message: error.message,
        fields: ["password", "confirmPassword"],
      };
  }

  const { confirmPassword } = params;

  if (password !== confirmPassword)
    return {
      success: false,
      message: "Girilen şifreler birbiriyle uyuşmuyor",
      fields: ["password", "confirmPassword"],
    };

  const token = uuidv4();
  const hashedPassword = await hash(password);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      token,
    },
  });

  if (!user)
    return {
      success: false,
      message: "Bilinmeyen bir hata oluştu",
      fields: [],
    };

  const session: Session = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    imageUrl: user.imageUrl,
    emailVerified: user.emailVerified,
    twoFA: false,
  };

  const jwt = createToken({ id: user.id });
  const jwtVerify = createToken({ email: user.email });

  try {
    await sendEmail(
      [user.email],
      "kafeasist hesabın oluşturuldu!",
      VerifyEmail({ token: jwtVerify }),
    );
  } catch (error: unknown) {
    console.error(error);
  }

  return {
    success: true,
    token: jwt,
    session,
  };
};

interface VerifyEmailProps {
  token: string;
}

const VERIFY_EMAIL_ERROR =
  "Bağlantının süresi dolmuş veya geçersiz. Lütfen tekrar deneyin.";

export const verifyEmail = async (props: VerifyEmailProps) => {
  const { token } = props;

  const response = getPayloadFromJWT<{ email: string }>(token);
  if (!response.success) return response;

  const { email } = response.payload;

  if (!email)
    return {
      success: false,
      message: VERIFY_EMAIL_ERROR,
    };

  const user = await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  if (!user)
    return {
      success: false,
      message: "Bilinmeyen bir hata oluştu",
    };

  await invalidateCache(Cache.SESSION + user.id);

  return {
    success: true,
    message: "E-posta adresin başarıyla doğrulandı!",
  };
};
