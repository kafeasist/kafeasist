import React from "react";

import { Card, CardContent } from "~/components/ui/card";
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
  <Card
    className={cn(
      "h-32 w-32 duration-200 hover:cursor-pointer hover:bg-gray-900",
      className,
      available ? "bg-card" : "bg-muted-foreground",
    )}
    {...props}
  >
    <CardContent className="flex h-full items-center justify-center">
      {name}
    </CardContent>
  </Card>
);

export default TableElement;
