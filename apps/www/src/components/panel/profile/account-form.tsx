// import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "@kafeasist/auth";
import { Callout } from "@tremor/react";
import { Info, Trash, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "~/components/ui/Input/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { getFirstLetter } from "~/utils/get-first-letter";

const AccountForm = ({ user }: { user: Session }) => {
  const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
  });

  // const formResolver = zodResolver(formSchema);

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: formResolver,
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="space-y-8">
      <Callout
        title="Profil ayarları"
        icon={() => <Info className="mr-2 h-5 w-5" />}
        color="neutral"
      >
        Profilinizde yapılan değişiklikler, tüm şirketlerinize uygulanır. Şirket
        ayarlarınızı değiştirmek için şirketlerim sayfasına gidin.
      </Callout>

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
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          type="email"
          placeholder="E-posta"
          {...form.register("email")}
          disabled
        />
        <Button type="submit">Kaydet</Button>
      </form>
    </div>
  );
};

export { AccountForm };
