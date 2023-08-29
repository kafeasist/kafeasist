import { verify } from "argon2";
import { sign } from "jsonwebtoken";

import { prisma } from "@kafeasist/db";

import { JWT_SECRET, JWT_SIGNING_OPTIONS } from "../config";
import { AuthResponse } from "../types/AuthResponse";
import { Session } from "../types/Session";

interface LoginParams {
  email: string;
  password: string;
}

export const login = async (
  params: LoginParams,
): Promise<AuthResponse<LoginParams>> => {
  const { email, password } = params;

  const user = await prisma.user.findUnique({
    where: { email },
    // include: { companies: true },
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

  const session: Session = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    imageUrl: user.imageUrl,
    isVerified: user.isVerified,
    twoFA: user.twoFA,
    // companies: user.companies,
  };

  const jwt = sign({ id: user.id }, JWT_SECRET, JWT_SIGNING_OPTIONS);

  return {
    success: true,
    token: jwt,
    session,
  };
};
