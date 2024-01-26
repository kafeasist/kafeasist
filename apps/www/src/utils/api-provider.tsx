"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

import { api } from "./api";

export function APIClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => {
    return new QueryClient();
  });

  const [apiClient] = React.useState(() => {
    return api.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV !== "production" ||
            (opts.direction == "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: "/api/trpc",
          fetch: async (url, init) => {
            return fetch(url, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
    });
  });

  return (
    <api.Provider client={apiClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </api.Provider>
  );
}
