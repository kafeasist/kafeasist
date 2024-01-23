"use client";

import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { RouterInputs } from "@kafeasist/api";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@kafeasist/ui";

import { Logo } from "~/components/logo";
import { api } from "~/utils/api";
import type { ToZod } from "~/utils/to-zod";

type LoginInputs = RouterInputs["auth"]["login"];

const loginSchema = z.object<ToZod<LoginInputs>>({
  email: z
    .string({ required_error: "Lütfen e-posta adresinizi giriniz." })
    .email("Geçerli bir e-posta adresi olmalıdır."),
  password: z
    .string({ required_error: "Lütfen parolanızı giriniz." })
    .min(8, "En az 8 karakter olmalıdır."),
});

export default function Login() {
  const { mutateAsync, isPending } = api.auth.login.useMutation();

  const form = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginInputs) => {
    const response = await mutateAsync(values);

    if (response.success) redirect("/panel");
    else {
      toast.error(response.message);

      response.fields.forEach((field) => {
        form.setError(field, {
          type: "manual",
          message: response.message,
        });
      });
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center">
        <Logo width={90} height={90} />
        <h1 className="text-2xl font-bold">Hesabına giriş yap</h1>
      </div>
      <div className="w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>E-posta adresi</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Parola</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" loading={isPending}>
              <LogIn className="mr-2 h-4 w-4" />
              Giriş yap
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-2 text-center">
        <p className="text-sm">
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="font-bold text-link underline">
            Hemen oluştur
          </Link>
        </p>
        <Link
          href="/sifremi-unuttum"
          className="text-sm font-bold text-link underline"
        >
          Şifremi unuttum
        </Link>
      </div>
    </div>
  );
}
