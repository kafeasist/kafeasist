"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { SessionProvider } from "~/context/SessionContext";
import { api } from "~/utils/api";
import { APIClientProvider } from "~/utils/api-provider";

function Session({ children }: { children?: React.ReactNode }) {
  const { data, isPending } = api.auth.getSession.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <SessionProvider session={data} loading={isPending}>
      {children}
    </SessionProvider>
  );
}

export function Providers({ children }: { children?: React.ReactNode }) {
  return (
    <ThemeProvider>
      <APIClientProvider>
        <Session>
          <Toaster position="bottom-right" richColors />
          {children}
        </Session>
      </APIClientProvider>
    </ThemeProvider>
  );
}
