"use client";

import * as React from "react";

import { Spinner } from "@kafeasist/ui";

import SideBar from "~/components/panel/side-bar";
import TopBar from "~/components/panel/top-bar";
import { api } from "~/utils/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending } = api.auth.getSession.useQuery();

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!data) return (window.location.href = "/giris");

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <TopBar />
      <div className="mt-[66px] flex w-full">
        <SideBar
          name={data.firstName + " " + data.lastName}
          email={data.email}
        />
        <div className="ml-24 w-full p-8 md:ml-72">{children}</div>
      </div>
    </div>
  );
}
