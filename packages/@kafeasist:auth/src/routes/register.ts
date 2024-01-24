import { hash } from "argon2";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "@kafeasist/db";

import { JWT_SECRET, JWT_SIGNING_OPTIONS } from "../config";
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

  const jwt = sign({ id: user.id }, JWT_SECRET, JWT_SIGNING_OPTIONS);

  return {
    success: true,
    token: jwt,
    session,
  };
};
