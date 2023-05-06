import { redis } from "..";

// import { Cache } from "../types/Cache";

export const invalidateCache = async (key: string): Promise<Error | true> => {
  const notFoundError = new Error("Key not found in cache");

  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return error;
  }

  return notFoundError;
};
