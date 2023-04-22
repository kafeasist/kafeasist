import { COOKIE_NAME } from "../config";
import { Session } from "../types/Session";
import { NextApiRequest } from "next";
import { parse } from "superjson";

export const getSessionFromCookie = (req: NextApiRequest): Session | null => {
  const cookie = req.cookies[COOKIE_NAME];

  if (!cookie) return null;

  return parse<Session>(cookie);
};
