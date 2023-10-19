import { Row } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "~/components/ui/button";
import { billingSchema } from "./schema";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = billingSchema.parse(row.original);

  return (
    <>
      {task.status === "paid" ? (
        <Button variant="ghost" size="sm">
          <Download className="mr-2 h-4 w-4" /> PDF
        </Button>
      ) : (
        <></>
      )}
    </>
  );
}
