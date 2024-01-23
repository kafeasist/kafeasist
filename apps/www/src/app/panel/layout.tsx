import { Metadata } from "next";

import SideBar from "~/components/panel/side-bar";
import TopBar from "~/components/panel/top-bar";

export const metadata: Metadata = {
  title: "kafeasist - Panel",
};

function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProvidersWrapper>
      <div className="bg-primary text-primary-foreground min-h-screen w-full overflow-hidden">
        <TopBar />
        <div className="mt-[66px] flex w-full">
          <SideBar />
          <div className="ml-24 w-full p-8 md:ml-72">{children}</div>
        </div>
      </div>
    </ProvidersWrapper>
  );
}
