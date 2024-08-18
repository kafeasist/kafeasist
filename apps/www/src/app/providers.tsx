"use client";

import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { SessionProvider } from "~/context/SessionContext";
import { api } from "~/utils/api";
import { APIClientProvider } from "~/utils/api-provider";

function Session({
  children,
  cookie,
}: {
  children?: React.ReactNode;
  cookie?: RequestCookie;
}) {
  const { data, isPending } = api.auth.getSession.useQuery(undefined, {
    /**
     * If the cookie is present, enable the session provider.
     * Otherwise, disable it.
     */
    enabled: !!cookie,

    /**
     * Disable refetching on mount, reconnect, and window focus.
     * We only want to fetch the session once.
     * Since the session won't change, we don't need to refetch it.
     */
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <SessionProvider session={data} loading={!cookie ? false : isPending}>
      {children}
    </SessionProvider>
  );
}

export function Providers({
  children,
  cookie,
}: {
  children?: React.ReactNode;
  cookie?: RequestCookie;
}) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem disableTransitionOnChange>
      <APIClientProvider>
        <Session cookie={cookie}>
          <Toaster position="bottom-right" richColors />
          {children}
        </Session>
      </APIClientProvider>
    </ThemeProvider>
  );
}
