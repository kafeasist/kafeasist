import { useRouter } from "next/navigation";
import { CompanyNotFound } from "~/components/panel/company-not-found";
import { Navbar } from "~/components/panel/navbar";
import { Spinner } from "~/components/ui/spinner";
import { useCompany } from "~/hooks/use-company";
import { useSession } from "~/hooks/use-session";

const Urunler = () => {
  // const data = [
  //   {
  //     id: "URN-0001",
  //     title: "Kahve",
  //     description: "Bu bir kahvedir",
  //     category: "Sıcak İçecek",
  //     price: "59,99",
  //   },
  //   {
  //     id: "URN-0002",
  //     title: "Çay",
  //     description: "Bu bir çaydır",
  //     category: "Sıcak İçecek",
  //     price: "19,99",
  //   },
  // ];

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
        <Navbar activeTab="products" />
        {selectedCompany ? (
          <div>
            <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
                <h2 className="text-3xl font-bold tracking-tight">Ürünler</h2>
              </div>
            </div>
            <div className="mb-8 ml-10 mr-8 flex flex-col space-y-2">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Kayıtlı ürünler
              </h2>
              <div className="text-sm text-muted-foreground">
                Kayıtlı ürünlerinizi buradan görüntüleyebilirsiniz.
              </div>
              {/* <DataTable data={data} columns={columns} /> */}
            </div>
            <div className="mb-8 ml-10 mr-8 flex flex-col space-y-2">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Kategoriler
              </h2>
              <div className="text-sm text-muted-foreground">
                Oluşturduğunuz kategorileri buradan görüntüleyebilirsiniz.
              </div>
              {/* <DataTable data={data} columns={columns} /> */}
            </div>
          </div>
        ) : (
          <CompanyNotFound loading={loading} />
        )}
      </div>
    </>
  );
};

export default Urunler;
