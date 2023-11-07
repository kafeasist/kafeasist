import Link from "next/link";

import { useCompany } from "~/hooks/use-company";
import { useSession } from "~/hooks/use-session";
import { Logo } from "../ui/logo";
import { Skeleton } from "../ui/skeleton";
import { MainNav, NavigationSlug } from "./main-nav";
import { MobileNavbar } from "./mobile-navbar";
import TeamSwitcher from "./team-switcher";
import { UserNav } from "./user-nav";

export const Navbar = ({ activeTab }: { activeTab?: NavigationSlug }) => {
  const { session } = useSession();
  const { loading, companies, selectedCompany, setSelectedCompany } =
    useCompany();

  // TODO: cache notifications
  // const { data: notifications, isFetching } =
  //   api.notification.getAll.useQuery();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="md:hidden">
          <MobileNavbar activeTab={activeTab} />
        </div>
        <Link href="/panel" className="hidden md:block">
          <Logo />
        </Link>
        <MainNav activeTab={activeTab} className="mx-6 hidden md:flex" />
        <div className="ml-auto flex items-center space-x-4">
          <div className="md:flex md:space-x-4">
            {loading ? null : (
              <TeamSwitcher
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                companies={companies}
              />
            )}
          </div>
          {/* {!notifications || isFetching ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : notifications.error ? (
            <p className="text-red-500">{notifications.error}</p>
          ) : (
            <Notifications notifications={notifications.data} />
          )} */}
          {session ? (
            <UserNav user={session} />
          ) : (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};
