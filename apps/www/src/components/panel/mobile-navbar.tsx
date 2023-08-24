import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { MainNav, NavigationSlug } from "./main-nav";
import { Menu } from "lucide-react";

export const MobileNavbar = ({ activeTab }: { activeTab?: NavigationSlug }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex justify-center">
          <Logo />
        </div>
        <MainNav
          activeTab={activeTab}
          className="mt-12 h-full flex-col space-x-0 space-y-8"
        />
      </SheetContent>
    </Sheet>
  );
};
