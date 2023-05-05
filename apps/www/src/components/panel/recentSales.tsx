import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>EÖ</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Ege Önder</p>
          <p className="text-sm text-muted-foreground">ege@kafeasist.com</p>
        </div>
        <div className="ml-auto font-medium">+₺299.99</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Ahmet Sonuç</p>
          <p className="text-sm text-muted-foreground">jahrein@twitch.tv</p>
        </div>
        <div className="ml-auto font-medium">+₺514.99</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>BA</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Barış Atay</p>
          <p className="text-sm text-muted-foreground">baris.atay@tip.org.tr</p>
        </div>
        <div className="ml-auto font-medium">+₺0.99</div>
      </div>
    </div>
  );
}
