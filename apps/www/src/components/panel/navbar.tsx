import { Search } from "../search";
import { Skeleton } from "../ui/skeleton";
import { MainNav } from "./mainNav";
import TeamSwitcher from "./teamSwitcher";
import { UserNav } from "./userNav";
import Image from "next/image";
import Link from "next/link";
import { useCompany } from "~/hooks/useCompany";
import { useSession } from "~/hooks/useSession";

export const Navbar = () => {
  const { session } = useSession();
  const { loading, companies, selectedCompany } = useCompany();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/panel">
          <Image
            src="/logowithtext.png"
            width="140"
            height="30"
            alt="kafeasist Logo"
            className="mb-1"
          />
        </Link>
        <MainNav className="mx-6 hidden lg:flex" />
        <div className="ml-auto flex items-center space-x-4">
          <div className="md:flex md:space-x-4">
            {loading ? (
              <Skeleton className="h-8 w-32 md:w-48" />
            ) : (
              companies &&
              selectedCompany && (
                <TeamSwitcher
                  selectedCompany={selectedCompany}
                  companies={companies}
                />
              )
            )}
            <Search className="hidden md:block" />
          </div>
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
