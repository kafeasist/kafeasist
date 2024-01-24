import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { cn } from "@kafeasist/ui";

import "./globals.css";

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
  const { get } = cookies();

  // TODO: Get the cookie name from the environment.
  const cookie = get("qid");

  return (
    <html suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <Providers cookie={cookie}>{children}</Providers>
      </body>
    </html>
  );
}
