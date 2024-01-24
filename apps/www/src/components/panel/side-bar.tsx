"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Croissant,
  Home,
  LayoutGrid,
  Link as LinkIcon,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Avatar, cn } from "@kafeasist/ui";

type Navigation =
  | "dashboard"
  | "tables"
  | "products"
  | "users"
  | "analytics"
  | "integrations"
  | "settings";

export default function SideBar({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const pathname = usePathname();

  const navigationItems: {
    id: Navigation;
    label: string;
    href: string;
    icon: LucideIcon;
    active: boolean;
  }[] = [
    {
      id: "dashboard",
      label: "Kontrol paneli",
      href: "/panel",
      icon: Home,
      active: pathname === "/panel",
    },
    {
      id: "tables",
      label: "Masalar",
      href: "/panel/masalar",
      icon: LayoutGrid,
      active: pathname === "/panel/masalar",
    },
    {
      id: "products",
      label: "Ürünler",
      href: "/panel/urunler",
      icon: Croissant,
      active: pathname === "/panel/urunler",
    },
    {
      id: "users",
      label: "Kullanıcılar",
      href: "/panel/kullanicilar",
      icon: Users,
      active: pathname === "/panel/kullanicilar",
    },
    {
      id: "analytics",
      label: "Analizler",
      href: "/panel/analiz",
      icon: BarChart3,
      active: pathname === "/panel/analiz",
    },
    {
      id: "integrations",
      label: "Entegrasyonlar",
      href: "/panel/entegrasyonlar",
      icon: LinkIcon,
      active: pathname === "/panel/entegrasyonlar",
    },
    {
      id: "settings",
      label: "Ayarlar",
      href: "/panel/ayarlar",
      icon: Settings,
      active: pathname === "/panel/ayarlar",
    },
  ];

  return (
    <div className="sticky left-0 top-16 z-10 h-[calc(100vh-4rem)] border border-border bg-secondary px-4 py-6 md:w-80">
      <div className="flex h-full flex-col justify-between">
        <nav className="flex w-full flex-col items-center justify-start space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-left text-sm transition-colors duration-150 ease-in-out hover:bg-muted",
                item.active && "bg-muted",
              )}
            >
              <item.icon size={24} />
              <span className="hidden truncate text-sm font-bold md:block">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <button className="flex w-full items-center space-x-2.5 rounded-lg p-2 duration-150 ease-in-out hover:bg-muted">
          <Avatar alt={name} placeholder={getInitials(name)} />
          <div className="hidden flex-col items-start justify-center md:flex">
            <span className="font-bold">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </button>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  const [firstName, lastName] = name.split(" ");

  return ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toLocaleUpperCase();
}
