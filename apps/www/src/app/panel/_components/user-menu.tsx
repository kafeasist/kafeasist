import Link from "next/link";
import { BadgeCheck, CircleHelp, LogOut, User } from "lucide-react";

import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
  Tooltip,
} from "@kafeasist/ui";

import { api } from "~/utils/api";
import { getInitials } from "~/utils/get-initials";
import { SideBarProps } from "./side-bar";

export function UserMenu({
  firstName,
  lastName,
  email,
  emailVerified,
}: SideBarProps) {
  const name = firstName && lastName ? `${firstName} ${lastName}` : undefined;

  const { mutateAsync, isPending } = api.auth.logout.useMutation();

  const handleLogout = async () => {
    await mutateAsync();

    window.location.href = "/";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex w-full cursor-pointer items-center space-x-2.5 rounded-lg p-2 duration-150 ease-in-out hover:bg-muted/50">
          {name ? (
            <Avatar alt={name} placeholder={getInitials(name)} />
          ) : (
            <Skeleton rounded className="h-10 w-10" />
          )}
          <div className="flex flex-col items-start justify-center">
            {name ? (
              <span className="truncate font-bold md:max-w-32 lg:max-w-48">
                {name}
              </span>
            ) : (
              <Skeleton className="h-5 w-24" />
            )}
            <div className="flex items-center space-x-2">
              {email ? (
                <>
                  <span className="truncate text-xs text-muted-foreground md:max-w-32 lg:max-w-48">
                    {email}
                  </span>
                  {emailVerified && (
                    <Tooltip text="Doğrulanmış hesap">
                      <BadgeCheck className="h-3 w-3 opacity-50" />
                    </Tooltip>
                  )}
                </>
              ) : (
                <Skeleton className="h-3 w-48" />
              )}
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-16 md:w-40 lg:w-72">
        <Link href="/panel/profil">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profil
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <CircleHelp className="mr-2 h-4 w-4" />
          Destek
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="font-bold text-destructive"
          onClick={handleLogout}
          loading={isPending}
          noselect
        >
          <LogOut className="mr-2 h-4 w-4" />
          Çıkış yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
