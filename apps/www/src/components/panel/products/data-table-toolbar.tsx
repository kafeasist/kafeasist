import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Plus, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Input } from "~/components/ui/Input/input";
import { useCategory } from "~/hooks/use-category";
import { CreateProductDialog } from "./create-product-dialog";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  const [open, setOpen] = useState(false);
  const { categories } = useCategory();

  return (
    <div className="flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
      <div className="flex w-full flex-col items-center space-y-4 md:flex-1 md:flex-row md:space-x-2 md:space-y-0">
        <Input
          placeholder="Ürün ara"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("categoryId") && (
          <DataTableFacetedFilter
            column={table.getColumn("categoryId")}
            title="Kategori"
            options={categories}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Temizle
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button variant="default" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ürün ekle
        </Button>
        <CreateProductDialog categories={categories} setDialog={setOpen} />
      </Dialog>
    </div>
  );
}
