import { SignOptions } from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_SIGNING_OPTIONS: SignOptions = {
  expiresIn: "1d",
};
export const COOKIE_NAME = process.env.COOKIE_NAME!;
export const REDIS_SESSION_PREFIX = "session";
