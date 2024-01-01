import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/Input/input";
import { cn } from "~/lib/utils";

interface TableElementProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  available: boolean;
}

const TableElement = ({
  className,
  name,
  available,
  ...props
}: TableElementProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Card
        className={cn(
          "h-32 w-32 duration-200 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900",
          className,
          available ? "bg-card" : "bg-red-400",
        )}
        {...props}
      >
        <CardContent className="flex h-full items-center justify-center">
          {name}
        </CardContent>
      </Card>
    </DialogTrigger>
    <DialogContent className="lg:min-w-max">
      <DialogHeader>
        <DialogTitle>Masa {name}</DialogTitle>
        <DialogDescription>{name} isimli masayı düzenleyin.</DialogDescription>
      </DialogHeader>
      <div className="flex items-center justify-center md:justify-between">
        <TableItems />
      </div>
      <DialogFooter></DialogFooter>
    </DialogContent>
  </Dialog>
);

const TableItems = () => {
  return (
    <div className="space-y-4">
      <Input type="search" placeholder="Ara..." className="h-9 w-full" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Kahvaltı Tabağı</CardTitle>
            <CardDescription>omletli zarttırı zurttutu</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default TableElement;
