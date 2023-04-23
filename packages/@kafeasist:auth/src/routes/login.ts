import { JWT_SECRET, JWT_SIGNING_OPTIONS } from "../config";
import { AuthResponse } from "../types/AuthResponse";
import { Session } from "../types/Session";
import { prisma } from "@kafeasist/db";
import { verify } from "argon2";
import { sign } from "jsonwebtoken";

interface LoginParams {
  emailOrPhone: string;
  password: string;
}

export const login = async (params: LoginParams): Promise<AuthResponse> => {
  const { emailOrPhone, password } = params;

  let email = true;

  if (!emailOrPhone.includes("@")) email = false;

  const user = await prisma.user.findUnique({
    where: { [email ? "email" : "phone"]: emailOrPhone },
  });

  if (!user)
    return {
      success: false,
      message: "E-posta/telefon veya şifre hatalı",
      fields: ["emailOrPhone", "password"],
    };

  if (!(await verify(user.password, password)))
    return {
      success: false,
      message: "E-posta/telefon veya şifre hatalı",
      fields: ["emailOrPhone", "password"],
    };

  const session: Session = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    isVerified: user.isVerified,
  };

  const jwt = sign(session, JWT_SECRET, JWT_SIGNING_OPTIONS);

  return {
    success: true,
    token: jwt,
    session,
  };
};
