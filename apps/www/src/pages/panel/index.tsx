import { DollarSign, Download } from "lucide-react";
import Image from "next/image";
import { CalendarDateRangePicker } from "~/components/panel/calendarDateRangePicker";
import { MainNav } from "~/components/panel/mainNav";
import { Overview } from "~/components/panel/overview";
import { RecentSales } from "~/components/panel/recentSales";
import TeamSwitcher from "~/components/panel/teamSwitcher";
import { UserNav } from "~/components/panel/userNav";
import { Search } from "~/components/search";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useProtected } from "~/hooks/useProtected";

const SkeletonPanel = () => (
  <>
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Skeleton className="h-8 w-32" />
          <div className="ml-auto flex items-center space-x-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <Skeleton className="h-6 w-24" />
            </TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              <Skeleton className="h-6 w-24" />
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              <Skeleton className="h-6 w-24" />
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              <Skeleton className="h-6 w-24" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  </>
);

const PanelCard = (props: {
  title: string;
  icon: React.ReactNode;
  content: {
    title: string;
    description: string;
  };
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
        {props.icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{props.content.title}</div>
        <p className="text-xs text-muted-foreground">
          {props.content.description}
        </p>
      </CardContent>
    </Card>
  );
};

const panelCards = [
  {
    title: "Satışlar",
    icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    content: {
      title: "₺0.00",
      description: "Bu ayki toplam satışlar",
    },
  },
];

const Panel = () => {
  const { session, loading } = useProtected();

  if (!session || loading) return <SkeletonPanel />;

  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <Image
              src="/logowithtext.png"
              width="140"
              height="30"
              alt="kafeasist Logo"
              className="mb-1"
            />
            <MainNav className="mx-6 hidden lg:flex" />
            <div className="ml-auto flex items-center space-x-4">
              <div className="hidden md:flex">
                <TeamSwitcher />
                <Search />
              </div>
              {session ? (
                <UserNav user={session} />
              ) : (
                <Skeleton className="h-8 w-8 rounded-full" />
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
            <h2 className="text-3xl font-bold tracking-tight">
              Kontrol paneli
            </h2>
            <div className="flex flex-col items-center space-x-2 space-y-4 md:flex-row md:space-y-0">
              <CalendarDateRangePicker />
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Verilerimi indir
              </Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid h-full grid-cols-1 md:inline-flex">
              <TabsTrigger value="overview">Genel bakış</TabsTrigger>
              <TabsTrigger value="analytics">Analitikler</TabsTrigger>
              <TabsTrigger value="reports">Raporlar</TabsTrigger>
              <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-2 lg:grid-cols-4">
                {panelCards.map((card) => (
                  <PanelCard
                    title={card.title}
                    content={card.content}
                    icon={card.icon}
                    key={card.title}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="md:col-span-4">
                  <CardHeader>
                    <CardTitle>Genel bakış</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>En son satışlar</CardTitle>
                    <CardDescription>
                      Bu ay 265 adet satış yaptınız.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Panel;
