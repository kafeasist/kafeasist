import Link from "next/link";
import { cn } from "~/lib/utils";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  activeTab?: NavigationSlug;
}

export type NavigationSlug = "overview" | "tables" | "products" | "analysis";

export function MainNav({ className, activeTab, ...props }: MainNavProps) {
  const navigation = [
    {
      name: "Genel bakış",
      href: "/",
      isActive: activeTab === "overview",
    },
    {
      name: "Masalar",
      href: "/masalar",
      isActive: activeTab === "tables",
    },
    {
      name: "Ürünler",
      href: "/urunler",
      isActive: activeTab === "products",
    },
    {
      name: "Analiz",
      href: "/analiz",
      isActive: activeTab === "analysis",
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {navigation.map((item) => (
        <Link
          href={"/panel" + item.href}
          key={item.name}
          className={`${
            !item.isActive && "text-muted-foreground"
          } text-sm font-medium transition-colors hover:text-primary`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
