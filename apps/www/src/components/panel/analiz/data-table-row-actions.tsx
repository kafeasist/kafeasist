import { Row } from "@tanstack/react-table";
import {
  Archive,
  Download,
  LucideIcon,
  MoreHorizontal,
  Pause,
  Trash,
  View,
  X,
} from "lucide-react";

import { analizSchema } from "~/components/panel/analiz/schema";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const MenuItem = (props: { icon: LucideIcon; name: string }) => {
  return (
    <DropdownMenuItem className="hover:cursor-pointer">
      <props.icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
      {props.name}
    </DropdownMenuItem>
  );
};

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = analizSchema.parse(row.original);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Menüyü aç</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {task.status === "waiting" ? (
          <>
            <MenuItem icon={View} name="Görüntüle" />
            <DropdownMenuSeparator />
            <MenuItem icon={Pause} name="Duraklat" />
            <MenuItem icon={X} name="İptal et" />
          </>
        ) : (
          <>
            <MenuItem icon={Download} name="PDF olarak indir" />
            <DropdownMenuSeparator />
            <MenuItem icon={Archive} name="Arşivle" />
            <MenuItem icon={Trash} name="Sil" />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
