import "~/styles/globals.css";

import React from "react";
import type { AppType } from "next/app";

import { Session } from "@kafeasist/auth";

import { Toaster } from "~/components/ui/Toast/toaster";
import CategoryProvider from "~/context/CategoryContext";
import CompanyProvider from "~/context/CompanyContext";
import ProductProvider from "~/context/ProductContext";
import SessionProvider from "~/context/SessionContext";
import { ThemeProvider } from "~/lib/theme-provider";
import { api } from "~/utils/api";

export const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <CompanyProvider>
        <ProductProvider>
          <CategoryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
            >
              <Component {...pageProps} />
              <Toaster />
            </ThemeProvider>
          </CategoryProvider>
        </ProductProvider>
      </CompanyProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
