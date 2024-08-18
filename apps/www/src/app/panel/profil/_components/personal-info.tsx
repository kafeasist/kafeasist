"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { RouterInputs } from "@kafeasist/api";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
} from "@kafeasist/ui";

import { useSession } from "~/hooks/use-session";
import { api } from "~/utils/api";
import { ToZod } from "~/utils/to-zod";

type PersonalInfoInputs = RouterInputs["user"]["update"];

const personalInfoSchema = z.object<ToZod<PersonalInfoInputs>>({
  firstName: z
    .string({
      required_error: "Lütfen adınızı giriniz",
    })
    .min(2, "En az 2 karakter olmalıdır"),
  lastName: z
    .string({
      required_error: "Lütfen soyadınızı giriniz",
    })
    .min(2, "En az 2 karakter olmalıdır"),
});

export function PersonalInfo() {
  const { session } = useSession();

  if (!session) return null;

  const { mutateAsync, isPending } = api.user.update.useMutation();

  const form = useForm<PersonalInfoInputs>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: session.firstName,
      lastName: session.lastName,
    },
  });

  const onSubmit = async (values: PersonalInfoInputs) => {
    const result = await mutateAsync(values);

    if (!result.error) return toast.success(result.message);
    toast.error(result.message);

    result.fields.forEach((field) => {
      form.setError(field, {
        type: "manual",
        message: result.message,
      });
    });
  };

  return (
    <Card id="hesap">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1 p-6">
            <h2 className="font-bold">Hesap ayarları</h2>
            <p className="text-sm text-muted-foreground">
              İsim ve soy isminizi güncelleyin.
            </p>
          </div>
          <CardContent>
            <div className="items-center gap-3 space-y-4 md:flex md:space-y-0">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full space-y-1">
                    <FormLabel>İsim</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={session.firstName}
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full space-y-1">
                    <FormLabel>Soy isim</FormLabel>
                    <FormControl>
                      <Input
                        defaultValue={session.lastName}
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Kaydet"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
