import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  Code,
  CreditCard,
  Link as LinkIcon,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useCompany } from "~/hooks/use-company";
import { useSession } from "~/hooks/use-session";
import { AccountForm } from "./account-form";
import { Billing } from "./billing";
import { Companies } from "./companies";
import { Developers } from "./developers";
import { Integrations } from "./integrations";

type Tabs =
  | "profil"
  | "faturalandirma"
  | "ayarlar"
  | "sirketlerim"
  | "api"
  | "kullanicilar"
  | "guvenlik"
  | "entegrasyonlar";

interface SettingsLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultTab: Tabs;
}

export const SettingsLayout = ({ defaultTab }: SettingsLayoutProps) => {
  const { session, setSession } = useSession();
  const { selectedCompany, companies, setSelectedCompany, loading } =
    useCompany();
  const searchParams = useSearchParams();
  let activeTab = searchParams.get("tab");
  if (!activeTab) activeTab = defaultTab;

  const tabs: {
    name: string;
    slug: Tabs;
    isActive: boolean;
    content: React.ReactNode;
    icon: React.ReactNode;
  }[] = [
    {
      name: "Profil",
      slug: "profil",
      isActive: activeTab === "profil",
      content: session ? (
        <AccountForm user={session} setSession={setSession} />
      ) : (
        <Spinner />
      ),
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      name: "Faturalandırma",
      slug: "faturalandirma",
      isActive: activeTab === "faturalandirma",
      content: session ? (
        <Billing user={session} company={selectedCompany} loading={loading} />
      ) : (
        <Spinner />
      ),
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      name: "Ayarlar",
      slug: "ayarlar",
      isActive: activeTab === "ayarlar",
      content: <div>ayarlar</div>,
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
    {
      name: "Şirketlerim",
      slug: "sirketlerim",
      isActive: activeTab === "sirketlerim",
      content: (
        <Companies
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          loading={loading}
        />
      ),
      icon: <Building2 className="mr-2 h-4 w-4" />,
    },
    {
      name: "Kullanıcılar",
      slug: "kullanicilar",
      isActive: activeTab === "kullanicilar",
      content: <div>kullanıcılar</div>,
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      name: "Güvenlik",
      slug: "guvenlik",
      isActive: activeTab === "guvenlik",
      content: <div>güvenlik</div>,
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
    {
      name: "Entegrasyonlar",
      slug: "entegrasyonlar",
      isActive: activeTab === "entegrasyonlar",
      content: <Integrations />,
      icon: <LinkIcon className="mr-2 h-4 w-4" />,
    },
    {
      name: "Geliştiriciler",
      slug: "api",
      isActive: activeTab === "api",
      content: <Developers />,
      icon: <Code className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-9 lg:px-12">
      <div className="grid h-max grid-cols-2 md:grid-cols-3 lg:col-span-2 lg:grid-cols-1">
        {tabs.map((tab) => (
          <Link
            href={"?tab=" + tab.slug}
            key={tab.slug}
            className={`${
              tab.isActive ? "bg-gray-100 dark:bg-gray-800" : ""
            } w-full rounded duration-150 hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <Button variant="link">
              {tab.icon} {tab.name}
            </Button>
          </Link>
        ))}
      </div>
      <div className="lg:col-span-7">
        {tabs.find((tab) => tab.isActive)?.content}
      </div>
    </div>
  );
};
