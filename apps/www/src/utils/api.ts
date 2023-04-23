// https://trpc.io/docs/nextjs/setup#4-create-trpc-hooks

import type { AppRouter } from "@kafeasist/api";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.URL) return process.env.URL;

  return `http://localhost:3000`;
};

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV !== "production" ||
            (opts.direction == "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});
