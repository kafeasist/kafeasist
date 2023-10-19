import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  // TODO: This is a dummy ratelimit, replace it with the real one
  limiter: Ratelimit.slidingWindow(2, "10 s"),
  analytics: true,
  prefix: "ratelimit",
});

export const REDIS_TTL = 6 * 60 * 60; // 6 hours

export * from "./helpers/setCache";
export * from "./helpers/readCache";
export * from "./helpers/invalidateCache";

export * from "./types/Cache";
