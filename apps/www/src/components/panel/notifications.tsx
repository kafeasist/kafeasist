import Link from "next/link";
import { Notification } from "@prisma/client";
import { Bell, Dot, Settings } from "lucide-react";

import { cn } from "~/lib/utils";
import { calculateDate } from "~/utils/calculate-date";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";

interface NotificationsProps extends React.HTMLAttributes<HTMLButtonElement> {
  notifications?: Notification[];
}

export function Notifications({
  notifications,
  className,
  ...props
}: NotificationsProps) {
  const isNotification = !notifications ? false : notifications.length !== 0;

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
        {isNotification ? (
          notifications?.map((notification) => (
            <div
              key={notification.id}
              className="flex rounded-lg duration-150 hover:bg-gray-900"
            >
              {notification.read ? null : (
                <Dot className="h-12 w-12 text-blue-500" />
              )}

              <Link className="space-y-1 p-2" href={notification.link}>
                <h4 className="text-md">{notification.title}</h4>
                <p className="text-sm text-gray-400">{notification.content}</p>
                <span className="text-xs text-gray-600">
                  {calculateDate(notification.createdAt)}
                </span>
              </Link>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-between p-2">
            <p className="text-sm text-gray-500">Bildirim yok</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
