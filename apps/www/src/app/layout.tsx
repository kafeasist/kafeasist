import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { cn } from "@kafeasist/ui";

import "./globals.css";

import { APIClientProvider } from "~/utils/api-provider";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kafeasist",
  description: "kafeasist",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <Providers>
          <APIClientProvider>
            <Toaster position="bottom-right" richColors />
            {children}
          </APIClientProvider>
        </Providers>
      </body>
    </html>
  );
}
