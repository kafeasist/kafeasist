import { prisma } from "@kafeasist/db";

import { validateEmail } from "../helpers/validators";
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

  if (user) {
    // TODO: Send email
  }

  return {
    success: true,
    token: "",
    session: {} as Session,
  };
};
