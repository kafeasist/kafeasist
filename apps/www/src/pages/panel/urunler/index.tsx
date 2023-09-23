import { useRouter } from "next/navigation";

import { columns as categoryColumns } from "~/components/panel/categories/columns";
import { DataTableToolbar as ToolbarCategories } from "~/components/panel/categories/data-table-toolbar";
import { Navbar } from "~/components/panel/navbar";
import { columns as productColumns } from "~/components/panel/products/columns";
import { DataTableToolbar as ToolbarProducts } from "~/components/panel/products/data-table-toolbar";
import { DataTable } from "~/components/ui/data-table";
import { Spinner } from "~/components/ui/spinner";
import { useCategory } from "~/hooks/use-category";
import { useProduct } from "~/hooks/use-product";
import { useSession } from "~/hooks/use-session";

const Urunler = () => {
  const { push } = useRouter();
  const { session, status } = useSession();

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
      <div className="mb-8 ml-10 mr-8 flex flex-col space-y-2">
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
    </div>
  );
};

export default Urunler;
