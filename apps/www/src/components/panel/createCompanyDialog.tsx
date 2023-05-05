import { RouterInputs } from "@kafeasist/api";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "~/components/ui/Input/input";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/useToast";
import { api } from "~/utils/api";

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
    formState: { errors },
    setError,
  } = useForm<CreateCompanyDialogProps>();

  const createCompany = api.company.create.useMutation();

  const onSubmit: SubmitHandler<CreateCompanyDialogProps> = async (data) => {
    const response = await createCompany.mutateAsync(data);

    if (response.error) {
      response.fields.forEach((field) => {
        setError(field, { message: response.message });
      });
    } else {
      setDialog(false);
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
                {...register("name", { required: true })}
                className={
                  errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
                }
              />
              {errors.name && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.name.type === "required"
                    ? "Lütfen şirket ismini giriniz"
                    : errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Şirket telefonu</Label>
              <Input
                id="phone"
                placeholder="2XX XXX XX XX"
                {...register("phone", { required: true })}
                className={
                  errors.phone
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.phone && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.phone.type === "required"
                    ? "Lütfen şirket telefonunu giriniz"
                    : errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Şirket adresi</Label>
              <Input
                id="address"
                placeholder="Örnek Mah. Örnek Sok. No: 1/1"
                {...register("address", { required: true })}
                className={
                  errors.address
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.address && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.address.type === "required"
                    ? "Lütfen şirket adresini giriniz"
                    : errors.address.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxCode">Vergi levhası</Label>
              <Input
                id="taxCode"
                placeholder="1234567890"
                {...register("taxCode", { required: true })}
                className={
                  errors.taxCode
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.taxCode && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.taxCode.type === "required"
                    ? "Lütfen vergi levhanızı giriniz"
                    : errors.taxCode.message}
                </p>
              )}
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="plan">Üyelik planı</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Bir plan seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Bedava</span> -{" "}
                    <span className="text-muted-foreground">
                      İki haftalık deneme süresi
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      ₺150 aylık her şirket için
                    </span>
                  </SelectItem>
                  <SelectItem value="enterprise">
                    <span className="font-medium">Kurumsal</span> -{" "}
                    <span className="text-muted-foreground">
                      ₺500 aylık her şirket için
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialog(false)}>
            Vazgeç
          </Button>
          <Button type="submit">Devam et</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
