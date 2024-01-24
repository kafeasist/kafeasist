"use client";

import * as React from "react";

import { Spinner } from "@kafeasist/ui";

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
    <div className="min-h-screen w-full overflow-hidden">
      <TopBar />
      <div className="mt-[66px] flex w-full">
        <SideBar
          name={user.firstName + " " + user.lastName}
          email={user.email}
        />
        <div className="ml-24 w-full p-8 md:ml-72">{children}</div>
      </div>
    </div>
  );
}
