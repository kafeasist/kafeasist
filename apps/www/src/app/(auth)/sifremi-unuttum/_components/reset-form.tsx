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

type ResetPasswordInputs = RouterInputs["auth"]["resetPassword"];

const resetPasswordSchema = z
  .object<ToZod<ResetPasswordInputs>>({
    token: z.string(),
    password: z
      .string({ required_error: "Lütfen yeni parolanızı giriniz." })
      .min(8, "En az 8 karakterden oluşmalıdır."),
    confirmPassword: z
      .string({
        required_error: "Lütfen yeni parolanızı tekrar giriniz.",
      })
      .min(8, "En az 8 karakterden oluşmalıdır."),
  })
  .refine(
    ({ confirmPassword, password }) => {
      return confirmPassword === password;
    },
    {
      message: "Şifreler uyuşmuyor",
      path: ["confirmPassword"],
    },
  );

export function ResetForm({ token }: { token: string }) {
  const { mutateAsync, isPending } = api.auth.resetPassword.useMutation();

  const form = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
    },
  });

  const onSubmit = async (values: ResetPasswordInputs) => {
    values.token = token;
    const response = await mutateAsync(values);

    if (response.success) return window.location.replace("/panel");

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
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Yeni parola</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                En az 8 karakterden oluşmalıdır.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Yeni parola tekrar</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem hidden>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
