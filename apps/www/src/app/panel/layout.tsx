"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { Spinner } from "@kafeasist/ui";

import { NoCompaniesFound } from "~/components/panel/no-companies-found";
import { SideBar } from "~/components/panel/side-bar";
import { TopBar } from "~/components/panel/top-bar";
import { useSession } from "~/hooks/use-session";
import { api } from "~/utils/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { session: user } = useSession();
  const { data, isPending } = api.company.get.useQuery(undefined, {
    /**
     * Only enable the query if the user is logged in.
     * Otherwise, the query will be disabled and the
     * `data` will be `undefined`.
     */
    enabled: !!user,
  });

  return (
    <div className="min-h-screen w-full">
      <TopBar />
      <div className="flex h-full w-full">
        <SideBar
          firstName={user?.firstName}
          lastName={user?.lastName}
          email={user?.email}
          emailVerified={user?.emailVerified ? true : false}
        />
        <div className="mt-16 h-full w-full p-8">
          {isPending ? (
            <div className="flex w-full justify-center">
              <Spinner />
            </div>
          ) : data!.length > 0 ? (
            children
          ) : pathname === "/panel/sirketlerim/olustur" ? (
            children
          ) : (
            <NoCompaniesFound />
          )}
        </div>
      </div>
    </div>
  );
}
