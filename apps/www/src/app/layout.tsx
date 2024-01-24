import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
  return (
    <html suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
