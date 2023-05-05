import type { Session } from "../types/Session";
import { decodeJwt } from "./decodeJwt";
import { prisma } from "@kafeasist/db";
import { verify } from "jsonwebtoken";
import type { NextApiRequest } from "next";

export const getSessionFromCookie = async (
  req: NextApiRequest,
): Promise<Session | null> => {
  const token = req.cookies[process.env.COOKIE_NAME!];

  if (!token) return null;

  if (!verify(token, process.env.JWT_SECRET!)) return null;

  const payload = decodeJwt(token) as { id: number };

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
    include: {
      companies: true,
    },
  });

  return user;
};
