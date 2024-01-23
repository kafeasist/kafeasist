"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

import type { ToZod } from "~/utils/to-zod";

type RegisterInputs = RouterInputs["auth"]["register"];

const registerSchema = z
  .object<ToZod<RegisterInputs>>({
    firstName: z.string().min(2, "En az 2 karakter olmalıdır"),
    lastName: z.string().min(2, "En az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi olmalıdır"),
    phone: z.string().min(10, "Geçerli bir telefon numarası olmalıdır"),
    password: z.string().min(8, "En az 8 karakter olmalıdır"),
    confirmPassword: z.string().min(8, "En az 8 karakter olmalıdır"),
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

export default function Register() {
  const form = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (values: RegisterInputs) => {
    console.log(values);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center space-y-12">
      <h1 className="text-3xl font-bold">Hesap oluştur</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İsim</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soy isim</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon numarası</FormLabel>
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
              <FormItem>
                <FormLabel>Şifre</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tekrar şifre</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Kayıt ol</Button>
        </form>
      </Form>
    </div>
  );
}
