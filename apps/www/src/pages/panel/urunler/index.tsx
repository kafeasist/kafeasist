import { useRouter } from "next/navigation";
import { FileCog, FileText, QrCode } from "lucide-react";

import { columns as categoryColumns } from "~/components/panel/categories/columns";
import { DataTableToolbar as ToolbarCategories } from "~/components/panel/categories/data-table-toolbar";
import { CompanyNotFound } from "~/components/panel/company-not-found";
import { Navbar } from "~/components/panel/navbar";
import { columns as productColumns } from "~/components/panel/products/columns";
import { DataTableToolbar as ToolbarProducts } from "~/components/panel/products/data-table-toolbar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { useCategory } from "~/hooks/use-category";
import { useCompany } from "~/hooks/use-company";
import { useProduct } from "~/hooks/use-product";
import { useSession } from "~/hooks/use-session";

const Urunler = () => {
  const { push } = useRouter();
  const { session, status } = useSession();
  const { selectedCompany, loading } = useCompany();

  const { categories, fetchAllCategories } = useCategory();
  const { products, fetchAllProducts } = useProduct();

  const { isLoading: isCategoriesLoading } = fetchAllCategories();
  const { isLoading: isProductsLoading } = fetchAllProducts();

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
    <div className="flex-col md:flex">
      <Navbar activeTab="products" />
      <div className="flex-1 p-8 pt-6">
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
          <h2 className="text-3xl font-bold tracking-tight">Ürünler</h2>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Ürünlerinizi buradan yönetebilirsiniz.
        </div>
        <Separator className="mt-6" />
      </div>
      {selectedCompany ? (
        <>
          <div className="mb-8 ml-10 mr-8 flex flex-col space-y-2">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Menü oluştur
            </h2>
            <div className="text-sm text-muted-foreground">
              PDF formatında, QR kodlu veya masaya özel menü oluşturabilirsiniz.
            </div>
          </div>
          <div className="grid grid-cols-1 space-y-4 md:grid-cols-3 md:space-y-0">
            <Card className="mx-8 md:ml-10 md:mr-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF formatında menü oluştur
                </CardTitle>
                <CardDescription>
                  PDF formatında menü oluşturmak için aşağıdaki butona tıklayın.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Menü oluşturduktan sonra menünüzü müşterilerinizle
                  paylaşabilirsiniz. Ayrıca menünüzü PDF formatında
                  indirebilirsiniz.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                <Button>Menü oluştur</Button>
                <Button variant="link">Detaylı bilgi</Button>
              </CardFooter>
            </Card>
            <Card className="mx-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="mr-2 h-4 w-4" />
                  QR kodlu menü oluştur
                </CardTitle>
                <CardDescription>
                  QR kodlu menü oluşturmak için aşağıdaki butona tıklayın.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  QR menü oluşturulduktan sonra size verilen QR kodu
                  müşterilerinizle paylaşabilirsiniz. Ayrıca menünüzü QR kodunu
                  okutarak görüntüleyebilirsiniz.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                <Button>Menü oluştur</Button>
                <Button variant="link">Detaylı bilgi</Button>
              </CardFooter>
            </Card>
            <Card className="mx-8 md:ml-2 md:mr-10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCog className="mr-2 h-4 w-4" />
                  Masaya özel menü oluştur
                </CardTitle>
                <CardDescription>
                  Masaya özel menü oluşturmak için aşağıdaki butona tıklayın.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">
                  Her masaya özel QR kodlu menü oluşturup müşterilerinizin
                  siparişlerini kendi telefonlarından verebilmesini
                  sağlayabilirsiniz. Bu sayede müşterilerinizin siparişlerini
                  daha hızlı alabilir ve müşteri memnuniyetini
                  arttırabilirsiniz.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
                <Button>Menü oluştur</Button>
                <Button variant="link">Detaylı bilgi</Button>
              </CardFooter>
            </Card>
          </div>
          <div className="mb-8 ml-10 mr-8 mt-8 flex flex-col space-y-2">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Kategoriler
            </h2>
            <div className="text-sm text-muted-foreground">
              Oluşturduğunuz kategorileri buradan görüntüleyebilirsiniz.
            </div>
            {isCategoriesLoading ? (
              <Spinner />
            ) : (
              <DataTable
                DataTableToolbar={ToolbarCategories}
                data={categories}
                columns={categoryColumns}
              />
            )}
          </div>
          <div className="mb-8 ml-10 mr-8 flex flex-col space-y-2">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Kayıtlı ürünler
            </h2>
            <div className="text-sm text-muted-foreground">
              Kayıtlı ürünlerinizi buradan görüntüleyebilirsiniz.
            </div>
            {isProductsLoading ? (
              <Spinner />
            ) : (
              <DataTable
                DataTableToolbar={ToolbarProducts}
                data={products}
                columns={productColumns}
              />
            )}
          </div>
        </>
      ) : (
        <CompanyNotFound loading={loading} />
      )}
    </div>
  );
};

export default Urunler;
