import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { cn } from "@kafeasist/ui";

import { env } from "../env";

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

  const cookie = get(env.COOKIE_NAME);

  return (
    <html suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <Providers cookie={cookie}>{children}</Providers>
      </body>
    </html>
  );
}
