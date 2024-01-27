"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { RouterInputs } from "@kafeasist/api";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
} from "@kafeasist/ui";

import { InnerTitle } from "~/components/panel/inner-title";
import { api } from "~/utils/api";
import { ToZod } from "~/utils/to-zod";

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
    required_error: "Lütfen planı giriniz",
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
                  <Input placeholder="TODO: Test" {...field} />
                </FormControl>
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
