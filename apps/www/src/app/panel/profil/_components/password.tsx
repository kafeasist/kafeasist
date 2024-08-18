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

type PasswordInputs = RouterInputs["user"]["changePassword"];

const passwordSchema = z
  .object<ToZod<PasswordInputs>>({
    oldPassword: z.string(),
    newPassword: z
      .string({
        required_error: "Lütfen yeni parolanızı giriniz",
      })
      .min(8, "En az 8 karakter olmalıdır"),
    newPasswordAgain: z
      .string({
        required_error: "Lütfen yeni parolanızı tekrar giriniz",
      })
      .min(8, "En az 8 karakter olmalıdır"),
  })
  .refine(
    ({ newPassword, newPasswordAgain }) => {
      return newPassword === newPasswordAgain;
    },
    {
      message: "Şifreler uyuşmuyor",
      path: ["newPasswordAgain"],
    },
  );

export function Password() {
  const { session } = useSession();

  if (!session) return null;

  const { mutateAsync, isPending } = api.user.changePassword.useMutation();

  const form = useForm<PasswordInputs>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values: PasswordInputs) => {
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
    <Card id="parola">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1 p-6">
            <h2 className="font-bold">Parola ayarları</h2>
            <p className="text-sm text-muted-foreground">
              Hesabınızın parola ayarlarını güncelleyin.
            </p>
          </div>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="w-full space-y-1">
                    <FormLabel>Eski parola</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="w-full space-y-1">
                    <FormLabel>Yeni parola</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPasswordAgain"
                render={({ field }) => (
                  <FormItem className="w-full space-y-1">
                    <FormLabel>Tekrar yeni parola</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isPending} />
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
