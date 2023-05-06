import { redis } from "..";

// import type { Cache } from "../types/Cache";

export const setCache = async (
  key: string,
  value: unknown,
  ttl: number,
): Promise<Error | boolean> => {
  try {
    await redis.set(key, value, { ex: ttl });
    await redis.expire(key, ttl);
    return true;
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) return error;
  }

  return false;
};
