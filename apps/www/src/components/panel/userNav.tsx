import { CreateCompanyDialog } from "./createCompanyDialog";
import { Session } from "@kafeasist/auth";
import { CreditCard, LogOut, PlusCircle, Settings, User } from "lucide-react";
import { useState } from "react";
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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdownMenu";

export function UserNav({ user }: { user: Session }) {
  const [open, setOpen] = useState(false);

  const getFirstLetter = () => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.imageUrl ? user.imageUrl : ""}
                alt="User avatar"
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
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Faturalandırma</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Seçenekler</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup
            onClick={() => {
              setOpen(true);
            }}
          >
            <DropdownMenuItem className="hover:cursor-pointer">
              <PlusCircle className="mr-2 h-5 w-5" />
              <span>Bir şirket oluştur</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Çıkış yap</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateCompanyDialog setDialog={setOpen} />
    </Dialog>
  );
}
