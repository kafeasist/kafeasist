import { BadgeDelta, type BadgeDeltaProps } from "@tremor/react";
import { useRouter } from "next/navigation";
import { Loading } from "~/components/loading";
import { CompanyNotFound } from "~/components/panel/company-not-found";
import { HourlySales } from "~/components/panel/hourly-sales";
import { MostSold } from "~/components/panel/most-sold";
import { Navbar } from "~/components/panel/navbar";
import { PaymentMethods } from "~/components/panel/payment-methods";
import { Status } from "~/components/panel/status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useCompany } from "~/hooks/use-company";
import { useSession } from "~/hooks/use-session";
import { valueFormatter } from "~/utils/value-formatter";

interface PanelCardProps {
  title: string;
  number: string;
  deltaType: BadgeDeltaProps["deltaType"];
  isIncreasePositive?: boolean;
  content: {
    title: string;
    description: string;
  };
}

const PanelCard = (props: PanelCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
        <BadgeDelta
          deltaType={props.deltaType}
          isIncreasePositive={props.isIncreasePositive ?? true}
          size="xs"
        >
          {props.number}
        </BadgeDelta>
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

const panelCards: PanelCardProps[] = [
  {
    title: "Satışlar",
    deltaType: "moderateIncrease",
    number: "+%3.2",
    content: {
      title: valueFormatter(17250.2),
      description: "Bugünkü toplam satışlar",
    },
  },
  {
    title: "Müşteriler",
    deltaType: "increase",
    number: "+12",
    content: {
      title: "76",
      description: "Bugün gelen müşteri sayısı",
    },
  },
  {
    title: "Açık siparişler",
    deltaType: "moderateDecrease",
    number: "-%0.9",
    content: {
      title: valueFormatter(360),
      description: "Şu anki açık sipariş tutarı",
    },
  },
  {
    title: "Kâr",
    deltaType: "moderateIncrease",
    number: "+%4.2",
    content: {
      title: valueFormatter(1442.05),
      description: "Bugünkü toplam kâr",
    },
  },
];

const Panel = () => {
  const { push } = useRouter();
  const { session, status } = useSession();
  const { selectedCompany, loading } = useCompany();

  if (!session && status === "loading") {
    return <Loading />;
  }

  if (!session && status !== "loading") {
    push("/giris");
    return;
  }

  return (
    <>
      <div className="flex-col md:flex">
        <Navbar activeTab="overview" />
        {selectedCompany ? (
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
              <h2 className="text-3xl font-bold tracking-tight">
                Kontrol paneli
              </h2>
            </div>
            <div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-2 lg:grid-cols-4">
              {panelCards.map((card) => (
                <PanelCard
                  title={card.title}
                  content={card.content}
                  deltaType={card.deltaType}
                  number={card.number}
                  isIncreasePositive={card.isIncreasePositive}
                  key={card.title}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
              <Card className="md:col-span-4">
                <CardHeader>
                  <CardTitle>Saatlik satışlar</CardTitle>
                  <CardDescription>
                    Saatlere göre satışlarınızın dağılımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HourlySales />
                </CardContent>
              </Card>
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>İşletme durumu</CardTitle>
                  <CardDescription>
                    Son analizde yapay zeka tarafından işletmenize verilen
                    skorlar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Status />
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Ödeme yöntemleri</CardTitle>
                  <CardDescription>
                    Bugün yapılan ödemelerin dağılımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentMethods />
                </CardContent>
              </Card>
              <Card className="md:col-span-6">
                <CardHeader>
                  <CardTitle>En çok satanlar</CardTitle>
                  <CardDescription>
                    Bugün en çok satılan ürünlerin dağılımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MostSold />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <CompanyNotFound loading={loading} />
        )}
      </div>
    </>
  );
};

export default Panel;
