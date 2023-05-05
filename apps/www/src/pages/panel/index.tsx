import { DollarSign, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDateRangePicker } from "~/components/panel/calendarDateRangePicker";
import { CreateCompanyDialog } from "~/components/panel/createCompanyDialog";
import { Navbar } from "~/components/panel/navbar";
import { Overview } from "~/components/panel/overview";
import { RecentSales } from "~/components/panel/recentSales";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Dialog } from "~/components/ui/dialog";
import { Spinner } from "~/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useCompany } from "~/hooks/useCompany";
import { useSession } from "~/hooks/useSession";

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
  const { push } = useRouter();
  const { session, status } = useSession();
  const { selectedCompany, loading } = useCompany();
  const [open, setOpen] = useState(false);

  if (!session && status === "loading") {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session && status !== "loading") {
    push("/giris");
    return;
  }

  return (
    <>
      <div className="flex-col md:flex">
        <Navbar />
        {selectedCompany ? (
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
                <TabsTrigger className="h-12 md:h-8" value="overview">
                  Genel bakış
                </TabsTrigger>
                <TabsTrigger className="h-12 md:h-8" value="analytics">
                  Analitikler
                </TabsTrigger>
                <TabsTrigger className="h-12 md:h-8" value="reports">
                  Raporlar
                </TabsTrigger>
                <TabsTrigger className="h-12 md:h-8" value="notifications">
                  Bildirimler
                </TabsTrigger>
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
                      <CardTitle>Yıl içindeki satışlar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>En son satışlar</CardTitle>
                      <CardDescription>
                        Bu ay 3 adet satış yaptınız.
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
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <div className="flex flex-col items-center justify-center space-y-4 p-14">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Size ait bir şirket bulunamadı.
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Hemen bir şirket oluşturun ve satışlarınızı takip edin. 🚀
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Şirket oluştur
                  </Button>
                </>
              )}
            </div>
            <CreateCompanyDialog setDialog={setOpen} />
          </Dialog>
        )}
      </div>
    </>
  );
};

export default Panel;
