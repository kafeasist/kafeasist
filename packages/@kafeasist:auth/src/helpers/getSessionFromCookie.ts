import type { Session } from "../types/Session";
import { decodeJwt } from "./decodeJwt";
import { verify } from "jsonwebtoken";
import type { NextApiRequest } from "next";

export const getSessionFromCookie = (req: NextApiRequest): Session | null => {
  const token = req.cookies[process.env.COOKIE_NAME!];

  if (!token) return null;

  if (!verify(token, process.env.JWT_SECRET!)) return null;

  const payload = decodeJwt(token) as Session & { iat: number; exp: number };

  return payload;
};
