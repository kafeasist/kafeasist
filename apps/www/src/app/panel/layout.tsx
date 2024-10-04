"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { Spinner } from "@kafeasist/ui";

import { CompanyProvider } from "~/context/CompanyContext";
import { useSession } from "~/hooks/use-session";
import { api } from "~/utils/api";
import { Alerts } from "./_components/alerts";
import { NoCompaniesFound } from "./_components/no-companies-found";
import { SideBar } from "./_components/side-bar";
import { TopBar } from "./_components/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const ALLOWED_PATHS = ["/panel/sirketlerim/olustur", "/panel/profil"];

  const { session: user } = useSession();
  const { data, isPending } = api.company.get.useQuery(undefined, {
    /**
     * Only enable the query if the user is logged in.
     * Otherwise, the query will be disabled and the
     * `data` will be `undefined`.
     */
    enabled: !!user,
  });

  const companies =
    data?.map((company) => ({
      id: company.id,
      name: company.name,
      address: company.address,
      plan: company.plan,
      imageUrl: company.imageUrl,
    })) || [];

  const selectedCompany = companies.find(
    (company) => company.id === Number(localStorage.getItem("selectedCompany")),
  );

  return (
    <CompanyProvider company={selectedCompany || companies[0]}>
      <div className="min-h-screen w-full">
        <TopBar
          companies={companies}
          isPending={isPending}
          firstName={user?.firstName}
          lastName={user?.lastName}
          email={user?.email}
          emailVerified={user?.emailVerified ? true : false}
        />
        <div className="flex h-full w-full">
          <SideBar
            firstName={user?.firstName}
            lastName={user?.lastName}
            email={user?.email}
            emailVerified={user?.emailVerified ? true : false}
          />
          <div className="mt-16 h-full w-full p-8">
            <Alerts />
            {isPending ? (
              <div className="flex w-full justify-center">
                <Spinner />
              </div>
            ) : data!.length > 0 || ALLOWED_PATHS.includes(pathname) ? (
              children
            ) : (
              <NoCompaniesFound />
            )}
          </div>
        </div>
      </div>
    </CompanyProvider>
  );
}
