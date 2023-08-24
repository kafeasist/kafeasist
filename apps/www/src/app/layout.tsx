import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { headers } from "next/headers";

import { TRPCReactProvider } from "./providers";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "kafeasist",
  description: "kafeasist is a restaurant management SaaS for the modern age",
  openGraph: {
    title: "kafeasist",
    description: "kafeasist is a restaurant management SaaS for the modern age",
    url: "https://kafeasist.com",
    siteName: "kafeasist",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kafeasist",
    creator: "@kafeasist",
  },
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={["font-sans", fontSans.variable].join(" ")}>
        <TRPCReactProvider headers={headers()}>
          {props.children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
