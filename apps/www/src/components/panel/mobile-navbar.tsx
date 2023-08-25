import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { MainNav, NavigationSlug } from "./main-nav";

export const MobileNavbar = ({ activeTab }: { activeTab?: NavigationSlug }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Link href="/panel" className="flex justify-center">
          <Logo />
        </Link>
        <MainNav
          activeTab={activeTab}
          className="mt-12 h-full flex-col space-x-0 space-y-8"
        />
      </SheetContent>
    </Sheet>
  );
};
