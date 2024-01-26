import { verify } from "jsonwebtoken";

import { JWT_SECRET, JWT_SIGNING_OPTIONS } from "../config";
import { decodeJwt } from "./decode-jwt";

const JWT_EXPIRED_ERROR_MESSAGE =
  "Bağlantınızın süresi dolmuş veya geçersiz olabilir. Lütfen tekrar deneyin.";

export const getPayloadFromJWT = <T>(
  token: string,
):
  | {
      success: false;
      message: typeof JWT_EXPIRED_ERROR_MESSAGE;
    }
  | { success: true; payload: T } => {
  try {
    verify(token, JWT_SECRET, JWT_SIGNING_OPTIONS);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: JWT_EXPIRED_ERROR_MESSAGE,
      };
    }
  }

  try {
    const payload = decodeJwt(token) as T;

    return {
      success: true,
      payload,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: JWT_EXPIRED_ERROR_MESSAGE,
      };
    }
  }

  return {
    success: false,
    message: JWT_EXPIRED_ERROR_MESSAGE,
  };
};
