import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useCompany } from "~/hooks/use-company";
import { usePlace } from "~/hooks/use-place";
import { useTable } from "~/hooks/use-table";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { Spinner } from "../../ui/spinner";

type CreateTableDialogProps = RouterInputs["table"]["create"];

export const CreateTableDialog = ({
  setDialog,
}: {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { places } = usePlace();
  const [place, setPlace] = useState<number>(-1);
  const { selectedCompany } = useCompany();
  const { addTable } = useTable();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateTableDialogProps>();
  const createTable = api.table.create.useMutation();

  const onSubmit: SubmitHandler<CreateTableDialogProps> = async (data) => {
    data = { ...data, companyId: selectedCompany?.id ?? -1, placeId: place };

    const response = await createTable.mutateAsync(data);

    if (response.error) {
      response.fields.forEach((field) => {
        setError(field, { message: response.message });
      });
    } else {
      setDialog(false);
      addTable(response.table!);
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
            <DialogTitle>Masa oluştur</DialogTitle>
            <DialogDescription>
              {selectedCompany.name} şirketi için yeni bir masa oluşturun
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Masa ismi</Label>
              <Input
                id="name"
                placeholder="Masa ismi"
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
            <div className="space-y-2">
              <Label htmlFor="name">Masa açıklaması (opsiyonel)</Label>
              <Input
                id="description"
                placeholder="Masa açıklaması (opsiyonel)"
                {...register("description")}
                className={
                  errors.description
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Mekan seçimi</Label>
              <Select
                disabled={isSubmitting}
                onValueChange={(value) => setPlace(parseInt(value))}
              >
                <SelectTrigger
                  className={
                    errors.placeId
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  {...register("placeId")}
                >
                  <SelectValue placeholder="Bir mekan seçin" />
                </SelectTrigger>
                <SelectContent>
                  {places.map((place) => (
                    <SelectItem value={String(place.id)} key={place.id}>
                      <span className="font-medium">{place.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.placeId && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.placeId.message}
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
