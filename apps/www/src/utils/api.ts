// https://trpc.io/docs/nextjs/setup#4-create-trpc-hooks

import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@kafeasist/api";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.URL) return process.env.URL;

  return `http://localhost:3000`;
};

export const api = createTRPCReact<AppRouter>({
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
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    };
  },
  ssr: false,
});
