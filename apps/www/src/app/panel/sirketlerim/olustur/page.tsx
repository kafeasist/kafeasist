"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus } from "lucide-react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Plan, RouterInputs } from "@kafeasist/api";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
  cn,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from "@kafeasist/ui";

import { api } from "~/utils/api";
import { ToZod } from "~/utils/to-zod";
import { InnerTitle } from "../../_components/inner-title";

type CreateCompanyInputs = RouterInputs["company"]["create"];

const registerSchema = z.object<ToZod<CreateCompanyInputs>>({
  name: z
    .string({ required_error: "Lütfen şirket adını giriniz" })
    .min(2, "En az 2 karakter olmalıdır"),
  address: z.string({ required_error: "Lütfen adresi giriniz" }),
  phone: z
    .string({ required_error: "Lütfen telefon numarasını giriniz" })
    .startsWith("(5", "Telefon numarası 5 ile başlamalıdır")
    .length(15, "Geçerli bir telefon numarası olmalıdır"),
  taxCode: z.string({ required_error: "Lütfen vergi numarasını giriniz" }),
  plan: z.enum(["FREE", "PRO", "ENTERPRISE"], {
    required_error: "Lütfen planınızı seçiniz",
  }),
});

export default function CreateCompany() {
  const { mutateAsync, isPending } = api.company.create.useMutation();

  const form = useForm<CreateCompanyInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: CreateCompanyInputs) => {
    const result = await mutateAsync(values);

    if (result.error) {
      toast.error(result.message);
      result.fields?.forEach((field) => {
        form.setError(field, { message: result.message });
      });
      return;
    }

    toast.success("Şirket oluşturuldu");
    return window.location.replace("/panel");
  };

  return (
    <>
      <InnerTitle
        title="Şirket oluştur"
        subtitle="Yeni bir şirket oluştur ve yönetmeye başla."
      />
      <Separator className="my-6 w-full" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Şirket ismi</FormLabel>
                <FormControl>
                  <Input placeholder="kafeasist" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Şirket adresi</FormLabel>
                <FormControl>
                  <Input placeholder="Örnek Mah. Örnek Sk." {...field} />
                </FormControl>
                <FormDescription>Şirketinizin fiziksel adresi</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Şirket telefonu</FormLabel>
                <FormControl>
                  <Input phone placeholder="(222) 222 22-22" {...field} />
                </FormControl>
                <FormDescription>
                  Şirketinizin telefon numarası (eğer yoksa kişisel telefon
                  numaranızı kullanabilirsiniz)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taxCode"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Vergi numarası</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormDescription>
                  Şirketinizin resmi vergi numarası
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plan"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Plan</FormLabel>
                <FormControl>
                  <RadioGroup>
                    <div className="grid grid-cols-3 gap-4">
                      <PlanCard
                        id="FREE"
                        name="BEDAVA"
                        description="Küçük bir işletmen mi var? Bedava planla kafeasist'in özelliklerini deneyebilirsin."
                        price={0}
                        features={[
                          "1 kullanıcı",
                          "1 şirket",
                          "Sınırsız fatura",
                          "Sınırsız müşteri",
                        ]}
                        field={field}
                      />
                      <PlanCard
                        id="PRO"
                        name="PRO"
                        description="İşletmeniz büyüdü ve daha fazla özellik mi istiyorsunuz? PRO planla kafeasist'in tüm özelliklerine erişebilirsin."
                        price={49}
                        features={[
                          "3 kullanıcı",
                          "3 şirket",
                          "Sınırsız fatura",
                          "Sınırsız müşteri",
                          "Öncelikli destek",
                        ]}
                        field={field}
                      />
                      <PlanCard
                        id="ENTERPRISE"
                        name="ÖZEL"
                        description="Özel bir plan mı istiyorsunuz? Özel planla kafeasist'in tüm özelliklerine erişebilirsin."
                        price={99}
                        features={[
                          "Sınırsız kullanıcı",
                          "Sınırsız şirket",
                          "Sınırsız fatura",
                          "Sınırsız müşteri",
                          "Öncelikli destek",
                          "Özel özellikler",
                        ]}
                        field={field}
                      />
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  Kullanmak istediğiniz planı seçin
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" loading={isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Şirket oluştur
          </Button>
        </form>
      </Form>
    </>
  );
}

interface PlanCardProps {
  id: Plan;
  name: string;
  description: string;
  price: number;
  features: string[];
  field: ControllerRenderProps<CreateCompanyInputs, "plan">;
}

function PlanCard({
  id,
  name,
  description,
  price,
  features,
  field,
}: PlanCardProps) {
  return (
    <Card
      className={cn("col-span-3 flex flex-col justify-between lg:col-span-1", {
        "border-link": field.value === id,
      })}
    >
      <div>
        <CardTitle>
          <div className="flex items-center space-x-4">
            <RadioGroupItem
              checked={field.value === id}
              id={id}
              value={id}
              onClick={() => field.onChange(id)}
              className="scale-150"
            />
            <Label htmlFor={id} className="text-xl font-bold">
              {name}
            </Label>
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardContent>
          <ul className="space-y-1">
            {features.map((feature) => (
              <li key={feature} className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-success-foreground" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </div>
      <CardFooter>
        <span className="text-xl font-bold">{price} ₺ / ay</span>
      </CardFooter>
    </Card>
  );
}
