"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldX } from "lucide-react";

import { Banner, Spinner } from "@kafeasist/ui";

import SideBar from "~/components/panel/side-bar";
import TopBar from "~/components/panel/top-bar";
import { useSession } from "~/hooks/use-session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, session: user } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) return window.location.replace("/giris");

  return (
    <div className="min-h-screen w-full">
      {!user.emailVerified && (
        <Banner
          title="Hesabınızı doğrulayın"
          subtitle="E-postanızdaki bağlantıya tıklayarak kafeasist hesabınızı doğrulayın"
          icon={<ShieldX className="h-4 w-4" />}
          className="bg-error text-error-foreground"
          action={
            <Link
              href="/panel/profil"
              className="text-sm underline hover:opacity-75"
            >
              Doğrulama bağlantısını tekrar gönder {"->"}
            </Link>
          }
          closable={false}
        />
      )}
      <TopBar />
      <div className="flex h-full w-full">
        <SideBar
          name={user.firstName + " " + user.lastName}
          email={user.email}
        />
        <div className="h-full w-full p-8">{children}</div>
      </div>
    </div>
  );
}
