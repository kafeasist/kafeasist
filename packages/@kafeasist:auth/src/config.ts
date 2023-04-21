import { SignOptions } from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_SIGNING_OPTIONS: SignOptions = {
  expiresIn: "1d",
};
