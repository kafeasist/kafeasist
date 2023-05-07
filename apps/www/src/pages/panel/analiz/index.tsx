import {
  BarChart,
  Brain,
  CalendarDays,
  Download,
  Hash,
  Heart,
  Trash,
  View,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CalendarDateRangePicker } from "~/components/panel/calendarDateRangePicker";
import { CompanyNotFound } from "~/components/panel/companyNotFound";
import { Navbar } from "~/components/panel/navbar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Spinner } from "~/components/ui/spinner";
import { useCompany } from "~/hooks/useCompany";
import { useSession } from "~/hooks/useSession";
import { calculateDate } from "~/utils/calculateDate";
import { prettifyString } from "~/utils/prettify";

type Analyse = {
  title: string;
  manual: boolean;
  date: Date;
};

const analyses: Analyse[] = [
  {
    title: "analiz_3_chocolate_station",
    manual: false,
    date: new Date(2023, 4, 7, 21, 8, 0),
  },
  {
    title: "analiz_2_chocolate_station",
    manual: true,
    date: new Date(2023, 0, 1),
  },
  {
    title: "analiz_1_chocolate_station",
    manual: true,
    date: new Date(2021, 2, 1),
  },
];

const favourites = [analyses[2]];

const Analiz = () => {
  const { push } = useRouter();
  const { session, status } = useSession();
  const { selectedCompany, loading } = useCompany();

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
        <Navbar activeTab="analysis" />
        {selectedCompany ? (
          <div>
            <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
                <h2 className="text-3xl font-bold tracking-tight">Analiz</h2>
                <div className="flex flex-col items-center space-x-2 space-y-4 md:flex-row md:space-y-0">
                  <CalendarDateRangePicker />
                  <Button size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Verilerimi indir
                  </Button>
                </div>
              </div>
            </div>
            <div className="mb-8 ml-10 mr-8 flex flex-col space-y-2">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Analiz yap
              </h2>
              <div className="text-sm text-muted-foreground">
                Manuel veya yapay zeka destekli analiz oluşturun.
              </div>
            </div>
            <div className="grid grid-cols-1 space-y-4 md:grid-cols-2 md:space-y-0">
              <Card className="mx-8 md:ml-10 md:mr-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2" />
                    Analiz oluştur
                  </CardTitle>
                  <CardDescription>
                    Manuel analiz oluşturmak için aşağıdaki butona tıklayın.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">
                    Manuel analizlerde, analiz yapılacak şirketin verilerini ve
                    analiz yapılacak tarih aralığını seçerek analiz
                    oluşturabilirsiniz. Analiz oluşturduktan sonra analizinizin
                    sonuçlarını görüntüleyebilirsiniz. Ayrıca analizinizin
                    sonuçlarını PDF formatında indirebilirsiniz.
                  </p>
                  <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                    <Button>Analiz et</Button>
                    <Button variant="link">Detaylı bilgi</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="mx-8 md:ml-2 md:mr-10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2" />
                    Yapay zeka destekli analiz oluştur
                  </CardTitle>
                  <CardDescription>
                    Yapay zeka destekli analiz yapmak için aşağıdaki butona
                    tıklayın.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">
                    Yapay zeka destekli analizlerde, analiz yapılacak şirketin
                    verilerini ve analiz yapılacak tarih aralığını seçerek
                    analiz oluşturabilirsiniz. Bu analiz türünde, analiz
                    sonuçları binlerce restoranın verileri ile eğitilerek
                    oluşturulmuş yapay zeka modeli tarafından oluşturulur.
                    Analiz oluşturduktan sonra analizinizin sonuçlarını
                    görüntüleyebilirsiniz. Ayrıca analizinizin sonuçlarını PDF
                    formatında indirebilirsiniz.
                  </p>
                  <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                    <Button>Analiz et</Button>
                    <Button variant="link">Detaylı bilgi</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-10">
              <Card className="m-2 border-none shadow-none md:col-span-7 md:m-4">
                <CardHeader>
                  <CardTitle>Geçmiş analizler</CardTitle>
                  <CardDescription>
                    Geçmiş analizlerinizi buradan görüntüleyebilirsiniz.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyses.map((analyse, index) =>
                    !favourites.includes(analyse) ? (
                      <Analyse index={index} analyse={analyse} />
                    ) : (
                      <Analyse index={index} analyse={analyse} favorite />
                    ),
                  )}
                </CardContent>
              </Card>
              <Card className="m-2 border-none shadow-none md:col-span-3 md:m-4">
                <CardHeader>
                  <CardTitle>Favorilerim</CardTitle>
                  <CardDescription>
                    Favori analizlerinizi buradan görüntüleyebilirsiniz.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favourites.map((favourite, index) => (
                    <Analyse
                      index={index}
                      analyse={favourite!}
                      favorite
                      variant="small"
                    />
                  ))}
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

const Analyse = ({
  index,
  analyse,
  variant = "default",
  favorite = false,
}: {
  index: number;
  analyse: Analyse;
  variant?: "default" | "small";
  favorite?: boolean;
}) => {
  return (
    <div
      key={index}
      className={`mb-4 flex flex-col justify-between rounded-md border p-4 last:mb-0 ${
        variant === "default" && "md:flex-row md:items-center"
      }`}
    >
      <div className="flex items-center space-x-4">
        <Hash />
        <div className="space-y-1">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div>
                <span className="text-sm font-medium leading-none hover:cursor-pointer hover:underline">
                  {prettifyString(analyse.title, 36)}
                </span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                {analyse.manual ? <BarChart /> : <Brain />}
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{analyse.title}</h4>
                  <p className="text-sm">
                    kafeasist tarafından oluşturulmuş{" "}
                    {analyse.manual ? "manuel" : "yapay zeka destekli"} analiz.
                  </p>
                  <div className="flex items-center pt-2">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">
                      Oluşturulan tarih{" "}
                      {analyse.date.toLocaleString("tr-tr", {
                        month: "long",
                      })}{" "}
                      {analyse.date.getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <p className="text-sm text-muted-foreground">
            {calculateDate(analyse.date)}
          </p>
        </div>
      </div>
      <div
        className={`mt-4 grid grid-cols-1 gap-2 ${
          variant === "default"
            ? "md:mt-0 md:grid-cols-4"
            : "md:mt-4 md:grid-cols-2"
        }`}
      >
        <Button variant="outline">
          <View className="mr-2 h-4 w-4" /> Görüntüle
        </Button>
        <Button variant="outline" className="group border-2 border-rose-200">
          {!favorite ? (
            <>
              <Heart className="mr-2 h-4 w-4 stroke-rose-600 group-hover:fill-rose-600" />
              Favorilere ekle
            </>
          ) : (
            <>
              <Heart className="mr-2 h-4 w-4 fill-rose-600 stroke-rose-600 group-hover:fill-transparent" />
              Favorilerden çıkar
            </>
          )}
        </Button>
        <Button variant="outline" className="border-2 border-blue-200">
          <Download className="mr-2 h-4 w-4 stroke-blue-600" /> İndir
        </Button>
        <Button variant="outline" className="border-2 border-rose-300">
          <Trash className="mr-2 h-4 w-4 stroke-rose-700" /> Sil
        </Button>
      </div>
    </div>
  );
};

export default Analiz;
