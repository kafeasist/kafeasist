import { MouseEventHandler, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  CreditCard,
  LogOut,
  Moon,
  Settings,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Session } from "@kafeasist/auth";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";
import { getFirstLetter } from "~/utils/get-first-letter";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";

export function UserNav({ user }: { user: Session }) {
  const [loggingOut, setLoggingOut] = useState(false);
  const { push } = useRouter();
  const { setTheme, theme } = useTheme();

  const logOut = api.auth.logout.useMutation();

  const handleLogout: MouseEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    setLoggingOut(true);
    await logOut.mutateAsync();
    push("/giris");
    setLoggingOut(false);
  };

  const changeTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.imageUrl ? user.imageUrl : ""}
              alt="Profil fotoğrafı"
            />
            <AvatarFallback>
              {getFirstLetter(user.firstName + " " + user.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-4" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center font-normal">
          <Avatar className="mr-4 h-8 w-8">
            <AvatarImage
              src={user.imageUrl ? user.imageUrl : ""}
              alt="Profil fotoğrafı"
            />
            <AvatarFallback>
              {getFirstLetter(user.firstName + " " + user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/panel/profil">
            <DropdownMenuItem className="hover:cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/panel/profil?tab=faturalandirma">
            <DropdownMenuItem className="hover:cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Faturalandırma</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/panel/profil?tab=ayarlar">
            <DropdownMenuItem className="hover:cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Ayarlar</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/panel/profil?tab=sirketlerim">
            <DropdownMenuItem className="hover:cursor-pointer">
              <Building2 className="mr-2 h-4 w-4" />
              <span>Şirketlerim</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
          <div className="flex w-full justify-between">
            <div className="flex items-center">
              <Moon className="mr-2 h-4 w-4" />
              <span>Koyu tema</span>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={changeTheme} />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>Çıkış yap</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
