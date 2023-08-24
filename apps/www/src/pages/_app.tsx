import "~/styles/globals.css";

import React from "react";
import type { AppType } from "next/app";

import { Session } from "@kafeasist/auth";

import { Toaster } from "~/components/ui/Toast/toaster";
import CompanyContext from "~/context/CompanyContext";
import SessionProvider from "~/context/SessionContext";
import { ThemeProvider } from "~/lib/theme-provider";
import { api } from "~/utils/api";

// import "@tremor/react/dist/esm/tremor.css";

export const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <CompanyContext>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </CompanyContext>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
