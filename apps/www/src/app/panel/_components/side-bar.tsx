"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Croissant,
  Grid,
  Home,
  LayoutGrid,
  Link as LinkIcon,
  Menu,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  cn,
  Separator,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@kafeasist/ui";

import { Logo } from "~/components/logo";
import { useCompany } from "~/hooks/use-company";
import { UserMenu } from "./user-menu";

type Navigation =
  | "dashboard"
  | "tables"
  | "products"
  | "users"
  | "categories"
  | "analytics"
  | "integrations"
  | "companies"
  | "billing";

const navigationItems: {
  id: Navigation;
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    id: "dashboard",
    label: "Kontrol paneli",
    href: "/panel",
    icon: Home,
  },
  {
    id: "tables",
    label: "Masalar",
    href: "/panel/masalar",
    icon: LayoutGrid,
  },
  {
    id: "products",
    label: "Ürünler",
    href: "/panel/urunler",
    icon: Croissant,
  },
  {
    id: "categories",
    label: "Kategoriler",
    href: "/panel/kategoriler",
    icon: Grid,
  },
  {
    id: "users",
    label: "Kullanıcılar",
    href: "/panel/kullanicilar",
    icon: Users,
  },
  {
    id: "analytics",
    label: "Analizler",
    href: "/panel/analiz",
    icon: BarChart3,
  },
  {
    id: "integrations",
    label: "Entegrasyonlar",
    href: "/panel/entegrasyonlar",
    icon: LinkIcon,
  },
];

export interface SideBarProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified?: boolean;
}

export function SideBar({
  firstName,
  lastName,
  email,
  emailVerified,
}: SideBarProps) {
  const pathname = usePathname();
  const { company } = useCompany();

  return (
    <div className="sticky left-0 z-10 hidden min-h-screen border-r border-border bg-secondary px-4 md:block md:min-w-56 lg:min-w-72">
      <div className="sticky left-0 top-0 flex h-screen flex-col justify-between py-4">
        <nav className="flex w-full flex-col items-center justify-start space-y-1 pt-20">
          {navigationItems.map((item) => {
            const path = item.href.split("/")[2] ?? "panel";
            let isActive = pathname.startsWith("/panel/" + path);

            if (path === "panel" && pathname === "/panel") isActive = true;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-left text-sm transition-colors duration-150 ease-in-out hover:bg-muted",
                  isActive && "bg-muted",
                )}
              >
                <item.icon size={20} />
                <span className="hidden truncate text-sm font-bold md:block">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="space-y-4">
          {company?.plan === "FREE" && <Upgrade />}

          <UserMenu
            firstName={firstName}
            lastName={lastName}
            email={email}
            emailVerified={emailVerified}
          />
        </div>
      </div>
    </div>
  );
}

function Upgrade() {
  return (
    <Card className="w-auto md:max-w-64 lg:max-w-80">
      <CardTitle>PRO Plan&apos;a Yükselt</CardTitle>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Daha derin yapay zeka destekli analizler, daha fazla entegrasyon, daha
          fazla kullanıcı ve özel destek.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="fit" className="w-full">
          ✨ Yükselt ✨
        </Button>
      </CardFooter>
    </Card>
  );
}

export function MobileSideBar({
  firstName,
  lastName,
  email,
  emailVerified,
}: SideBarProps) {
  const pathname = usePathname();
  const { company } = useCompany();

  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="border-none">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-full flex-col justify-between"
      >
        <SheetHeader>
          <SheetTitle>
            <div className="mb-2 flex items-center space-x-2">
              <Logo height={40} width={40} />
              <span className="text-2xl">kafeasist</span>
            </div>
          </SheetTitle>
          <Separator />
          <nav className="flex w-full flex-col items-center justify-start space-y-1 pt-2">
            {navigationItems.map((item) => {
              const path = item.href.split("/")[2] ?? "panel";
              let isActive = pathname.startsWith("/panel/" + path);

              if (path === "panel" && pathname === "/panel") isActive = true;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-left text-sm transition-colors duration-150 ease-in-out hover:bg-muted",
                    isActive && "bg-muted",
                  )}
                >
                  <item.icon size={20} />
                  <span className="truncate text-sm font-bold">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </SheetHeader>
        <SheetFooter>
          <div className="space-y-4">
            {company?.plan === "FREE" && <Upgrade />}

            <UserMenu
              firstName={firstName}
              lastName={lastName}
              email={email}
              emailVerified={emailVerified}
            />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
