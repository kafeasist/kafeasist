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
import { useCompany } from "~/hooks/use-company";
import { usePlace } from "~/hooks/use-place";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { Spinner } from "../../ui/spinner";

type CreatePlaceDialogProps = RouterInputs["category"]["create"];

export const CreatePlaceDialog = ({
  setDialog,
}: {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { selectedCompany } = useCompany();
  const { addPlace } = usePlace();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreatePlaceDialogProps>();
  const createPlace = api.place.create.useMutation();

  const onSubmit: SubmitHandler<CreatePlaceDialogProps> = async (data) => {
    data = { ...data, companyId: selectedCompany?.id ?? -1 };

    const response = await createPlace.mutateAsync(data);

    if (response.error) {
      response.fields.forEach((field) => {
        setError(field, { message: response.message });
      });
    } else {
      setDialog(false);
      addPlace(response.place!);
    }

    toast({
      title: response.error ? "HATA" : "BAŞARILI",
      description: response.message,
      variant: response.error ? "destructive" : "default",
    });
  };

  return (
    <DialogContent>
      {selectedCompany ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Mekan oluştur</DialogTitle>
            <DialogDescription>
              {selectedCompany.name} şirketi için yeni bir mekan oluşturun
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Mekan ismi</Label>
              <Input
                id="name"
                placeholder="Mekan ismi"
                {...register("name")}
                className={
                  errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                }
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setDialog(false)}
              type="reset"
            >
              Vazgeç
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Devam et"}
            </Button>
          </DialogFooter>
        </form>
      ) : (
        <Spinner />
      )}
    </DialogContent>
  );
};
