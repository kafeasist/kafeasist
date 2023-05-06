import { redis } from "..";

// import type { Cache } from "../types/Cache";

export const readCache = async <T>(key: string): Promise<null | T> => {
  console.log("readCache hit");

  try {
    const value = await redis.get<T>(key);
    return value;
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) return null;
  }

  return null;
};
