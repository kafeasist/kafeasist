import { Bell, Settings } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";

interface NotificationsProps extends React.HTMLAttributes<HTMLButtonElement> {
  isNotification?: boolean;
}

export function Notifications({
  className,
  isNotification = false,
  ...props
}: NotificationsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button
            className={cn(className)}
            {...props}
            variant="ghost"
            size="icon"
          >
            <Bell className="h-4 w-4" />
          </Button>
          {isNotification && (
            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-700 hover:cursor-pointer" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 space-y-2 p-4"
        align="end"
        forceMount
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bildirimler</h3>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Bildirim yok</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
