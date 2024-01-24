import { parse } from "cookie";
import { verify } from "jsonwebtoken";

import { prisma } from "@kafeasist/db";
import { readCache, setCache } from "@kafeasist/redis";

import type { Session } from "../types/Session";
import { decodeJwt } from "./decode-jwt";

const REDIS_SESSION_PREFIX = "session";
const REDIS_TTL = 60 * 60 * 24; // 1 day

export const getSessionFromCookie = async (
  headers: Headers,
): Promise<Session | null> => {
  const cookieName = process.env.COOKIE_NAME!;

  const cookie = headers.get("cookie");

  if (!cookie) return null;

  const token = parse(cookie)[cookieName];

  if (!token) return null;

  if (!verify(token, process.env.JWT_SECRET!)) return null;

  const payload = decodeJwt(token) as { id: number };

  const session = await readCache<Session>(`session:${payload.id}`);

  if (!session) {
    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) return null;

    await setCache(`${REDIS_SESSION_PREFIX}:${user.id}`, user, REDIS_TTL);

    return user;
  }

  return session;
};
