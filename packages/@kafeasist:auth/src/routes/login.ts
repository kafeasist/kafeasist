import { verify } from "argon2";

import { prisma } from "@kafeasist/db";
import { Cache, invalidateCache } from "@kafeasist/redis";

import { createToken } from "../helpers/create-token";
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
    emailVerified: user.emailVerified,
    twoFA: user.twoFA,
    // companies: user.companies,
  };

  const jwt = createToken({ id: user.id });
  await invalidateCache(Cache.COMPANY + user.id);

  return {
    success: true,
    token: jwt,
    session,
  };
};
