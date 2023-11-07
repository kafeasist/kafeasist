import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash, Upload } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { RouterInputs } from "@kafeasist/api";
import { Session } from "@kafeasist/auth";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { InfoCard } from "~/components/ui/info-card";
import { Input } from "~/components/ui/Input/input";
import { Label } from "~/components/ui/label";
import { Spinner } from "~/components/ui/spinner";
import { SessionContextType } from "~/context/SessionContext";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { getFirstLetter } from "~/utils/get-first-letter";
import { maskEmail } from "~/utils/mask-email";
import { ChangePasswordDialog } from "../change-password-dialog";

type UpdateUserInputs = RouterInputs["user"]["update"];

const AccountForm = ({
  user,
  setSession,
}: {
  user: Session;
  setSession: SessionContextType["setSession"];
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordDialog, setPasswordDialog] = useState<boolean>(false);
  const { toast } = useToast();

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm<UpdateUserInputs>({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  const updateUser = api.user.update.useMutation();

  const onSubmit: SubmitHandler<UpdateUserInputs> = async (values) => {
    setLoading(true);

    const response = await updateUser.mutateAsync(values);

    if (response.error) {
      response.fields.forEach((field) => {
        setError(field, { message: response.message });
      });

      toast({
        title: "HATA",
        description: response.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "BAŞARILI",
        description: "Profiliniz başarıyla güncellendi",
        variant: "default",
      });

      setSession({ ...user, ...values });
    }

    setLoading(false);
  };

  return (
    <div className="mb-8 space-y-8">
      <InfoCard title="Profil ayarları" severity="info">
        Profilinizde yapılan değişiklikler, tüm şirketlerinize uygulanır. Şirket
        ayarlarınızı değiştirmek için şirketlerim sayfasına gidin.
      </InfoCard>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profil</h2>
          <h3 className="text-md mb-4 text-muted-foreground">
            Profilinizi buradan yönetebilirsiniz.
          </h3>
        </div>
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
              {...register("firstName")}
              className={
                errors.firstName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
              disabled={loading}
            />
            {errors.firstName && (
              <p className="text-left text-xs text-muted-foreground text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="lastName">Soyad</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Soyad"
              {...register("lastName")}
              className={
                errors.lastName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
              disabled={loading}
            />
            {errors.lastName && (
              <p className="text-left text-xs text-muted-foreground text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <Button className="mt-4" type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Kaydet"}
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
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
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
            <Button variant="outline" onClick={() => setPasswordDialog(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Değiştir
            </Button>
          </div>
          {!user.twoFA && (
            <span className="text-left text-xs text-muted-foreground">
              İki faktörlü kimlik doğrulamayı{" "}
              <Link href="/panel/profil?tab=guvenlik">
                <Button variant="link" className="p-0">
                  <span className="text-xs text-blue-700 dark:text-blue-400">
                    etkinleştirmenizi
                  </span>
                </Button>
              </Link>{" "}
              tavsiye ederiz.
            </span>
          )}
        </div>
        <ChangePasswordDialog setDialog={setPasswordDialog} />
      </Dialog>
    </div>
  );
};

export { AccountForm };
