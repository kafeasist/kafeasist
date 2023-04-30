import "~/styles/globals.css";
import { Session } from "@kafeasist/auth";
import type { AppType } from "next/app";
import React from "react";
import { Toaster } from "~/components/ui/Toast/toaster";
import SessionProvider from "~/context/SessionContext";
import { api } from "~/utils/api";

export const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(App);
