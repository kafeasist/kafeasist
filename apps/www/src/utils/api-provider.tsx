"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink, loggerLink } from "@trpc/client";
import SuperJSON from "superjson";

import { env } from "~/env";
import { api } from "./api";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Avoid refetching data when the window regains focus
        staleTime: 30 * 1000,
      },
    },
  });

let queryClient: QueryClient | undefined = undefined;

const getQueryClient = () => {
  if (typeof window === "undefined") return createQueryClient();

  return (queryClient ??= createQueryClient());
};

export function APIClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [apiClient] = React.useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            env.NODE_ENV !== "production" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          fetch: async (url, init) => {
            return fetch(url, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={apiClient} queryClient={queryClient}>
        {children}
        <ReactQueryDevtools />
      </api.Provider>
    </QueryClientProvider>
  );
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;

  return env.URL;
};
