"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@kafeasist/ui";

import { api } from "~/utils/api";
import type { ToZod } from "~/utils/to-zod";

type ForgotPasswordInputs = RouterInputs["auth"]["forgotPassword"];

const forgotPasswordSchema = z.object<ToZod<ForgotPasswordInputs>>({
  email: z
    .string({ required_error: "Lütfen e-posta adresinizi giriniz." })
    .email("Geçerli bir e-posta adresi olmalıdır."),
});

export function ForgotForm() {
  const { mutateAsync, isPending } = api.auth.forgotPassword.useMutation();

  const form = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordInputs) => {
    const response = await mutateAsync(values);

    if (response.success)
      return toast.success(
        "Şifre sıfırlama bağlantısı e-posta adresine gönderildi.",
      );

    toast.error(response.message);

    response.fields.forEach((field) => {
      form.setError(field, {
        type: "manual",
        message: response.message,
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>E-posta adresi</FormLabel>
              <FormControl>
                <Input placeholder="deneme@kafeasist.com" {...field} />
              </FormControl>
              <FormDescription>
                kafeasist hesabınızla ilişkili e-posta adresinizi giriniz.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" loading={isPending}>
          Şifremi sıfırla
        </Button>
      </form>
    </Form>
  );
}
