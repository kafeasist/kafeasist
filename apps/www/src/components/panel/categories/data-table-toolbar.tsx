import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Input } from "~/components/ui/Input/input";
import { CreateCategoryDialog } from "./create-category-dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
      <div className="flex w-full flex-col items-center space-y-4 md:flex-1 md:flex-row md:space-x-2 md:space-y-0">
        <Input
          placeholder="Kategori ara"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button variant="default" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Kategori ekle
        </Button>
        <CreateCategoryDialog setDialog={setOpen} />
      </Dialog>
    </div>
  );
}
