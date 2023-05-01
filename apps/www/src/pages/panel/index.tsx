import {
  CreditCard,
  DollarSign,
  Download,
  PersonStanding,
  Users,
} from "lucide-react";
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
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <TeamSwitcher />
              <Search />
              {session ? (
                <UserNav user={session} />
              ) : (
                <Skeleton className="h-8 w-8 rounded-full" />
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Kontrol paneli
            </h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Verilerini indir
              </Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Genel bakış</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analitikler
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Raporlar
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Bildirimler
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Toplam kazanç
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₺52,231.89</div>
                    <p className="text-xs text-muted-foreground">
                      +%20.1 geçen aydan bu yana
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Satışlar
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₺612,234.25</div>
                    <p className="text-xs text-muted-foreground">
                      +%19 geçen aydan bu yana
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Kişi sayısı
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">44</div>
                    <p className="text-xs text-muted-foreground">
                      +8 geçen saatten bu yana
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Masa sayısı
                    </CardTitle>
                    <PersonStanding className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">11</div>
                    <p className="text-xs text-muted-foreground">
                      +2 geçen saatten bu yana
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Genel bakış</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
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
