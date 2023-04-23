import type { Session } from "../types/Session";
import { verify } from "jsonwebtoken";
import type { Jwt } from "jsonwebtoken";
import type { NextApiRequest } from "next";
import { parse } from "superjson";

export const getSessionFromCookie = (req: NextApiRequest): Session | null => {
  const cookie = req.cookies[process.env.SESSION_COOKIE_NAME!];

  if (!cookie) return null;

  const token = parse<string>(cookie);
  if (!verify(token, process.env.JWT_SECRET!)) return null;

  const jwt = token as unknown as Jwt;
  if (typeof jwt.payload === "string") return null;

  return jwt.payload as Session;
};
