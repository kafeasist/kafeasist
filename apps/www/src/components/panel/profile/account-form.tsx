import { Pencil, Trash, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Session } from "@kafeasist/auth";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { InfoCard } from "~/components/ui/info-card";
import { Input } from "~/components/ui/Input/input";
import { Label } from "~/components/ui/label";
import { getFirstLetter } from "~/utils/get-first-letter";
import { maskEmail } from "~/utils/mask-email";

const AccountForm = ({ user }: { user: Session }) => {
  const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // TODO: Change user info
    console.log(values);
  };

  return (
    <div className="mb-8 space-y-8">
      <InfoCard title="Profil ayarları" severity="info">
        Profilinizde yapılan değişiklikler, tüm şirketlerinize uygulanır. Şirket
        ayarlarınızı değiştirmek için şirketlerim sayfasına gidin.
      </InfoCard>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Profil</h2>
        <Label htmlFor="picture">Profil fotoğrafı</Label>
        <div className="flex flex-col items-center lg:flex-row">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user.imageUrl ? user.imageUrl : ""}
              alt="Profil fotoğrafı"
            />
            <AvatarFallback>
              {getFirstLetter(user.firstName + " " + user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 flex flex-col items-center space-y-4 lg:ml-4 lg:mt-0 lg:items-start lg:space-y-2">
            <div className="space-x-2">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Fotoğraf yükle
              </Button>
              <Button variant="outline">
                <Trash className="mr-2 h-4 w-4" />
                Sil
              </Button>
            </div>
            <span className="text-center text-xs text-muted-foreground lg:text-left">
              PNG, JPEG veya JPG formatında 10MB ve altı fotoğrafları
              yükleyebilirsiniz
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col justify-between space-y-4 lg:flex-row lg:space-x-2 lg:space-y-0">
          <div className="w-full space-y-2">
            <Label htmlFor="firstName">Ad</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Ad"
              {...form.register("firstName")}
            />
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="lastName">Soyad</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Soyad"
              {...form.register("lastName")}
            />
          </div>
        </div>
        <Button className="mt-4" type="submit">
          Kaydet
        </Button>
      </form>
      <div className="mt-4 space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <div className="flex items-center justify-center space-x-2">
          <Input
            id="email"
            type="email"
            placeholder="E-posta"
            defaultValue={maskEmail(user.email)}
            disabled
          />
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" /> Değiştir
          </Button>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor="email">Şifre</Label>
        <div className="flex items-center justify-center space-x-2">
          <Input
            id="password"
            type="password"
            placeholder="Şifre"
            defaultValue={"****************"}
            disabled
          />
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" /> Değiştir
          </Button>
        </div>
      </div>
    </div>
  );
};

export { AccountForm };
