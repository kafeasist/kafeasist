import { BarChart, Brain, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { CalendarDateRangePicker } from "~/components/panel/calendar-date-range-picker";
import { columns } from "~/components/panel/columns";
import { CompanyNotFound } from "~/components/panel/company-not-found";
import { Navbar } from "~/components/panel/navbar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import { Spinner } from "~/components/ui/spinner";
import { useCompany } from "~/hooks/use-company";
import { useSession } from "~/hooks/use-session";

const Analiz = () => {
  const tasks = [
    {
      id: "AN-230524",
      title:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae.",
      status: "done",
      label: "documentation",
      type: "manual",
    },
    {
      id: "AN-230525",
      title:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae.",
      status: "waiting",
      label: "documentation",
      type: "ai",
    },
  ];

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
            <div className="p-10">
              <div className="mb-8 space-y-2">
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  Geçmiş analizler
                </h2>
                <div className="text-sm text-muted-foreground">
                  Geçmiş analizlerinizi buradan görüntüleyebilirsiniz.
                </div>
              </div>
              <DataTable data={tasks} columns={columns} />
            </div>
          </div>
        ) : (
          <CompanyNotFound loading={loading} />
        )}
      </div>
    </>
  );
};

export default Analiz;
