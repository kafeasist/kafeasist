"use client";

import * as React from "react";
import Link from "next/link";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@kafeasist/ui";

import { AuthWrapper } from "~/components/auth/wrapper";
import { api } from "~/utils/api";
import type { ToZod } from "~/utils/to-zod";

type RegisterInputs = RouterInputs["auth"]["register"];

const registerSchema = z
  .object<ToZod<RegisterInputs>>({
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
    email: z
      .string({
        required_error: "Lütfen e-posta adresinizi giriniz",
      })
      .email("Geçerli bir e-posta adresi olmalıdır"),
    phone: z
      .string({
        required_error: "Lütfen telefon numaranızı giriniz",
      })
      .min(10, "Geçerli bir telefon numarası olmalıdır"),
    password: z
      .string({
        required_error: "Lütfen parolanızı giriniz",
      })
      .min(8, "En az 8 karakter olmalıdır"),
    confirmPassword: z
      .string({
        required_error: "Lütfen parolanızı tekrar giriniz",
      })
      .min(8, "En az 8 karakter olmalıdır"),
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

function Footer() {
  return (
    <p className="text-sm">
      Hesabın var mı?{" "}
      <Link href="/giris" className="font-bold text-link underline">
        Giriş yap
      </Link>
    </p>
  );
}

export default function Register() {
  const { mutateAsync, isPending } = api.auth.register.useMutation();

  const form = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterInputs) => {
    const result = await mutateAsync(values);

    if (result.success) return (window.location.href = "/panel");

    toast.error(result.message);

    result.fields.forEach((field) => {
      form.setError(field, {
        type: "manual",
        message: result.message,
      });
    });
  };

  return (
    <AuthWrapper title="Hesabınızı oluşturun" footer={<Footer />}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex w-full justify-between space-x-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>İsim</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Soy isim</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                  kafeasist hesabınızda kullanılacak ana e-posta adresi
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Telefon numarası</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 555 55 55" {...field} />
                </FormControl>
                <FormDescription>
                  Size ulaşabileceğimiz bir telefon numarası
                </FormDescription>
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
                <FormDescription>
                  En az 8 karakterden oluşan bir parola
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
                <FormLabel>Tekrar parola</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" loading={isPending}>
            <LogIn className="mr-2 h-4 w-4" />
            Kayıt ol
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
}
