import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { labels, statuses, types } from "~/data/analiz";
import { Analiz } from "~/data/schema";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Progress } from "../ui/progress";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Analiz>[] = [
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
      <DataTableColumnHeader column={column} title="Analiz" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Başlık" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
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

      if (!status) {
        return null;
      }

      if (status.value === "waiting")
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex w-[100px] items-center hover:cursor-pointer">
                {status.icon && (
                  <status.icon className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <span>{status.label}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="space-y-4">
              <h1>
                {row.getValue("id")} analizi için son hızla{" "}
                {row.getValue("type") == "ai"
                  ? "yapay zekamız çalışıyor."
                  : "çalışıyoruz."}
              </h1>
              <div className="text-sm text-muted-foreground">
                Analiziniz üzerinde çalışıyoruz, işlem bittiğinde size haber
                vereceğiz. Lütfen bekleyiniz.
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex flex-col">
                  <span>
                    <span className="font-medium">Analiz:</span>{" "}
                    {row.getValue("id")}
                  </span>
                  <span>
                    <span className="font-medium">Tür:</span>{" "}
                    {row.getValue("type") == "ai" ? "Yapay Zeka" : "Manuel"}
                  </span>
                  <span>
                    <span className="font-medium">Durum:</span> {status.label}
                  </span>
                  <span>
                    <span className="font-medium">İlerleme:</span> 30.91 / 100
                  </span>
                </div>
                <Progress value={30} />
                <p className="text-xs text-muted-foreground">
                  Tahmini kalan süre: 1 saat 23 dakika
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        );

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tür" />
    ),
    cell: ({ row }) => {
      const type = types.find((type) => type.value === row.getValue("type"));

      if (!type) {
        return null;
      }

      return (
        <div className="flex items-center">
          {type.icon && (
            <type.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{type.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
