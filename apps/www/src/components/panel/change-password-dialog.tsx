import { SubmitHandler, useForm } from "react-hook-form";

import { RouterInputs } from "@kafeasist/api";

import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/Input/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { Spinner } from "../ui/spinner";

type ChangePasswordDialogInputs = RouterInputs["user"]["changePassword"];

export const ChangePasswordDialog = ({
  setDialog,
}: {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ChangePasswordDialogInputs>();
  const changePassword = api.user.changePassword.useMutation();

  const onSubmit: SubmitHandler<ChangePasswordDialogInputs> = async (data) => {
    const response = await changePassword.mutateAsync(data);

    if (response.error) {
      response.fields.forEach((field) => {
        setError(field, { message: response.message });
      });
    } else {
      setDialog(false);
    }

    toast({
      title: response.error ? "HATA" : "BAŞARILI",
      description: response.message,
      variant: response.error ? "destructive" : "default",
    });
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Şifremi değiştir</DialogTitle>
          <DialogDescription>Mevcut şifrenizi değiştirin</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Eski şifreniz</Label>
              <Input
                id="oldPassword"
                type="password"
                placeholder="Eski şifreniz"
                {...register("oldPassword")}
                className={
                  errors.oldPassword
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.oldPassword && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Yeni şifreniz</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Yeni şifreniz"
                {...register("newPassword")}
                className={
                  errors.newPassword
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.newPassword && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tekrar yeni şifreniz</Label>
              <Input
                id="newPasswordAgain"
                type="password"
                placeholder="Tekrar yeni şifreniz"
                {...register("newPasswordAgain")}
                className={
                  errors.newPasswordAgain
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.newPasswordAgain && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.newPasswordAgain.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            type="reset"
            disabled={isSubmitting}
            onClick={() => setDialog(false)}
          >
            Vazgeç
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : "Şifremi değiştir"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
