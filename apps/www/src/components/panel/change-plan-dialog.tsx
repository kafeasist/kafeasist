import { useState } from "react";
import { Company } from "@prisma/client";
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
import { Label } from "~/components/ui/label";
import { plans } from "~/data/plans";
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

type ChangePlanDialogInputs = RouterInputs["company"]["changePlan"];

export const ChangePlanDialog = ({
  setDialog,
  company,
}: {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  company: Company;
}) => {
  const [plan, setPlan] = useState<Plan>(company.plan);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ChangePlanDialogInputs>();
  const changePlan = api.company.changePlan.useMutation();

  const onSubmit: SubmitHandler<ChangePlanDialogInputs> = async (data) => {
    data = { plan: plan, id: company.id };

    const response = await changePlan.mutateAsync(data);

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
          <DialogTitle>Planı değiştir</DialogTitle>
          <DialogDescription>Şirket planınızı değiştirin</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4 py-2 pb-4">
          <input type="text" hidden value={company.id} {...register("id")} />
          <div className="space-y-2">
            <Label htmlFor="plan">Üyelik planı</Label>
            <Select
              disabled={isSubmitting}
              defaultValue={company.plan}
              onValueChange={(value) => setPlan(value as Plan)}
            >
              <SelectTrigger
                className={
                  errors.plan ? "border-red-500 focus-visible:ring-red-500" : ""
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
            {isSubmitting ? <Spinner /> : "Planı değiştir"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
