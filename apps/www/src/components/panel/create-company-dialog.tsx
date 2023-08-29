import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Plan, RouterInputs } from "@kafeasist/api";

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
import { plans } from "~/data/plans";
import { useCompany } from "~/hooks/use-company";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";

type CreateCompanyDialogProps = RouterInputs["company"]["create"];

export const CreateCompanyDialog = ({
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
  } = useForm<CreateCompanyDialogProps>();
  const [plan, setPlan] = useState<Plan | undefined>(undefined);
  const { addCompany, setSelectedCompany } = useCompany();

  const createCompany = api.company.create.useMutation();

  const onSubmit: SubmitHandler<CreateCompanyDialogProps> = async (data) => {
    if (plan) data = { ...data, plan: plan };

    const response = await createCompany.mutateAsync(data);

    if (response.error) {
      response.fields.forEach((field) => {
        setError(field, { message: response.message });
      });
    } else {
      setDialog(false);
      if (response.company) {
        addCompany(response.company);
        setSelectedCompany(response.company);
      }
    }

    toast({
      title: response.error ? "HATA" : "BAŞARILI",
      description: response.error
        ? response.message
        : "Şirket başarıyla oluşturuldu",
      variant: response.error ? "destructive" : "default",
    });
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Şirket oluştur</DialogTitle>
          <DialogDescription>Yeni bir şirket oluşturun</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Şirket ismi</Label>
              <Input
                id="name"
                placeholder="kafeasist"
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
              <Label htmlFor="phone">Şirket telefonu</Label>
              <Input
                id="phone"
                placeholder="2XX XXX XX XX"
                {...register("phone")}
                className={
                  errors.phone
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Şirket adresi</Label>
              <Input
                id="address"
                placeholder="Örnek Mah. Örnek Sok. No: 1/1"
                {...register("address")}
                className={
                  errors.address
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.address && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxCode">Vergi levhası</Label>
              <Input
                id="taxCode"
                placeholder="1234567890"
                {...register("taxCode")}
                className={
                  errors.taxCode
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.taxCode && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.taxCode.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Üyelik planı</Label>
              <Select
                disabled={isSubmitting}
                onValueChange={(value) => setPlan(value as Plan)}
              >
                <SelectTrigger
                  className={
                    errors.plan
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  {...register("plan")}
                >
                  <SelectValue placeholder="Bir plan seçin" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem value={plan.id} key={plan.id}>
                      <span className="font-medium">{plan.name}</span> -{" "}
                      <span className="text-muted-foreground">
                        {plan.description}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.plan && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.plan.message}
                </p>
              )}
            </div>
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
    </DialogContent>
  );
};
