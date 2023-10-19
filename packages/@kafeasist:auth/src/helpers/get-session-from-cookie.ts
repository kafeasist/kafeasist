import type { NextApiRequest } from "next";
import { verify } from "jsonwebtoken";

import { prisma } from "@kafeasist/db";
import { readCache, setCache } from "@kafeasist/redis";

import type { Session } from "../types/Session";
import { decodeJwt } from "./decode-jwt";

// TODO: Move to env
const REDIS_SESSION_PREFIX = "session";
const REDIS_TTL = 60 * 60 * 24; // 1 day

export const getSessionFromCookie = async (
  req: NextApiRequest,
): Promise<Session | null> => {
  const token = req.cookies[process.env.COOKIE_NAME!];

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
