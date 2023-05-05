import "~/styles/globals.css";
import { Session } from "@kafeasist/auth";
import type { AppType } from "next/app";
import React from "react";
import { Toaster } from "~/components/ui/Toast/toaster";
import CompanyContext from "~/context/CompanyContext";
import SessionProvider from "~/context/SessionContext";
import { api } from "~/utils/api";

export const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <CompanyContext>
        <Component {...pageProps} />
        <Toaster />
      </CompanyContext>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
