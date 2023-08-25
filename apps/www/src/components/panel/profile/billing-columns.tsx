import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Billing, BillingStatus } from "~/data/schema";
import { cn } from "~/lib/utils";
import { prettifyDate } from "~/utils/prettify-date";
import { valueFormatter } from "~/utils/value-formatter";
import { DataTableColumnHeader } from "../data-table-column-header";

const statuses: { label: string; value: BillingStatus; color: string }[] = [
  { label: "Ödendi", value: "paid", color: "" },
  { label: "Ödeniyor", value: "ongoing", color: "" },
  { label: "Ödenmedi", value: "unpaid", color: "" },
];

export const columns: ColumnDef<Billing>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Hepsini seç"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sütun seç"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Referans numarası" />
    ),
    cell: ({ row }) => row.getValue("id"),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Toplam" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {valueFormatter(row.getValue("price"))}
          </span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Durum" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      return (
        <div className="flex w-[100px] items-center hover:cursor-pointer">
          {status && (
            <Badge
              variant="outline"
              className={cn(
                status.value === "unpaid"
                  ? "bg-rose-200 dark:bg-rose-800"
                  : status.value === "paid"
                  ? "bg-lime-200 dark:bg-lime-800"
                  : "bg-yellow-100 dark:bg-yellow-700",
              )}
            >
              {status.label}
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tarih" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{prettifyDate(row.getValue("date"))}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
  },
];
