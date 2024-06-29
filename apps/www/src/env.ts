import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    URL: z.string().url().default("http://localhost:3000"),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    COOKIE_NAME: z.string().default("qid"),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    SENTRY_DSN: z.string().url(),
    RESEND_API_KEY: z.string(),
    NO_REPLY_EMAIL: z.string().email(),
    TEAM_EMAIL: z.string().email(),
    SUPPORT_EMAIL: z.string().email(),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
