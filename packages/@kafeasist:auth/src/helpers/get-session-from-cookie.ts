import { parse } from "cookie";

import { prisma } from "@kafeasist/db";
import { readCache, setCache } from "@kafeasist/redis";

import { REDIS_SESSION_PREFIX } from "../config";
import type { Session } from "../types/Session";
import { getPayloadFromJWT } from "./get-payload-from-jwt";

const REDIS_TTL = 60 * 60 * 24; // 1 day

export const getSessionFromCookie = async (
  headers: Headers,
): Promise<Session | null> => {
  const cookieName = process.env.COOKIE_NAME!;

  const cookie = headers.get("cookie");

  if (!cookie) return null;

  const token = parse(cookie)[cookieName];

  if (!token) return null;

  const response = getPayloadFromJWT<{ id: number }>(token);
  if (!response.success) return null;

  const { id } = response.payload;

  const session = await readCache<Session>(`session:${id}`);

  if (!session) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    await setCache(`${REDIS_SESSION_PREFIX}:${user.id}`, user, REDIS_TTL);

    return user;
  }

  return session;
};
