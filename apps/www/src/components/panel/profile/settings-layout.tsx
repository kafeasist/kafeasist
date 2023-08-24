import { AccountForm } from "./account-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loading } from "~/components/loading";
import { Button } from "~/components/ui/button";
import { useSession } from "~/hooks/use-session";

type Tabs = "profil" | "faturalandirma" | "ayarlar" | "sirketlerim";

interface SettingsLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultTab: Tabs;
}

export const SettingsLayout = ({ defaultTab }: SettingsLayoutProps) => {
  const { session } = useSession();
  const searchParams = useSearchParams();
  let activeTab = searchParams.get("tab");
  if (!activeTab) activeTab = defaultTab;

  const tabs: {
    name: string;
    slug: Tabs;
    isActive: boolean;
    content: React.ReactNode;
  }[] = [
    {
      name: "Profil",
      slug: "profil",
      isActive: activeTab === "profil",
      content: session ? <AccountForm user={session} /> : <Loading />,
    },
    {
      name: "Faturalandırma",
      slug: "faturalandirma",
      isActive: activeTab === "faturalandirma",
      content: <div>faturalandırma</div>,
    },
    {
      name: "Ayarlar",
      slug: "ayarlar",
      isActive: activeTab === "ayarlar",
      content: <div>ayarlar</div>,
    },
    {
      name: "Şirketlerim",
      slug: "sirketlerim",
      isActive: activeTab === "sirketlerim",
      content: <div>şirketlerim</div>,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-9 lg:px-12">
      <div className="flex flex-row md:col-span-2 lg:flex-col">
        {tabs.map((tab) => (
          <Link
            href={"?tab=" + tab.slug}
            key={tab.slug}
            className={`${
              tab.isActive ? "bg-gray-100 dark:bg-gray-800" : ""
            } w-full rounded duration-150 hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            <Button variant="link">{tab.name}</Button>
          </Link>
        ))}
      </div>
      <div className="md:col-span-7">
        {tabs.find((tab) => tab.isActive)?.content}
      </div>
    </div>
  );
};
