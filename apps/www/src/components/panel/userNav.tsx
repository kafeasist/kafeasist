import { Search } from "../search";
import { Spinner } from "../ui/spinner";
import { CreateCompanyDialog } from "./createCompanyDialog";
import { Session } from "@kafeasist/auth";
import {
  Building2,
  CreditCard,
  Keyboard,
  LogOut,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdownMenu";
import { api } from "~/utils/api";

export function UserNav({ user }: { user: Session }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { push } = useRouter();

  const logOut = api.auth.logout.useMutation();

  const getFirstLetter = () => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const handleLogout: MouseEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    setLoggingOut(true);
    await logOut.mutateAsync();
    push("/giris");
    setLoggingOut(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.imageUrl ? user.imageUrl : ""}
                alt="Profil fotoğrafı"
              />
              <AvatarFallback>{getFirstLetter()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 p-4" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
            <div className="mt-4 block w-full md:hidden">
              <Search />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Faturalandırma</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Ayarlar</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Kısayollar</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Building2 className="mr-2 h-4 w-4" />
              <span>Şirketlerim</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpen(true);
              }}
              className="hover:cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Yeni şirket</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
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
      <CreateCompanyDialog setDialog={setOpen} />
    </Dialog>
  );
}
