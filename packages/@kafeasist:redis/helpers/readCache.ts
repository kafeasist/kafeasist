import { redis } from "..";
import type { Cache } from "../types/Cache";

export const readCache = async (key: Cache): Promise<Error | string> => {
  const notFoundError = new Error("Key not found");

  try {
    const value = await redis.get<string>(key);
    if (value === null) return notFoundError;
    return value;
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) return error;
  }

  return notFoundError;
};
