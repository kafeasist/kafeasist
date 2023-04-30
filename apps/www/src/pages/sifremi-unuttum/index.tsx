import { RouterInputs } from "@kafeasist/api";
import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "~/components/ui/Input/input";
import { H1 } from "~/components/ui/Typography/h1";
import { Lead } from "~/components/ui/Typography/lead";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { useToast } from "~/hooks/useToast";
import { api } from "~/utils/api";

type ForgotPasswordInputs = RouterInputs["auth"]["forgotPassword"];

const PasswordForm = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordInputs>();
  const [loading, setLoading] = useState<boolean>(false);

  const forgotPassword = api.auth.forgotPassword.useMutation();

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    setLoading(true);
    const response = await forgotPassword.mutateAsync(data);

    if (!response.success)
      response.fields.forEach((field) => {
        setError(field, { message: response.message });
      });

    toast({
      title: !!response.success ? "BAŞARILI" : "HATA",
      description: !!response.success
        ? "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi"
        : response.message,
      variant: !!response.success ? "default" : "destructive",
    });
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-auto w-full space-y-4 md:w-3/4 lg:w-1/2"
    >
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="E-posta"
          {...register("email", { required: true })}
          className={
            errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        />
        {errors.email && (
          <p className="text-left text-xs text-muted-foreground text-red-500">
            {errors.email.type === "required"
              ? "Lütfen e-posta adresinizi giriniz"
              : errors.email.message}
          </p>
        )}
      </div>
      <Button type="submit" className="min-w-full" disabled={loading}>
        {loading ? <Spinner /> : "Şifremi sıfırla"}
      </Button>
    </form>
  );
};

const ForgotPassword = () => {
  return (
    <main className="flex">
      <div className="h-screen bg-gradient-to-l from-yellow-200 via-green-200 to-green-500 lg:w-1/2"></div>
      <div className="flex h-screen w-screen flex-col items-center justify-center text-center lg:w-1/2">
        <div className="container space-y-6">
          <H1>Şifremi sıfırla</H1>
          <Lead>Lütfen hesabınıza kayıtlı e-posta adresinizi girin</Lead>
          <PasswordForm />
          <div className="m-auto flex w-full items-center md:w-3/4 lg:w-1/2">
            <Separator className="w-auto grow" />
            <span className="mx-4">veya</span>
            <Separator className="w-auto grow" />
          </div>
          <Link href="/giris">
            <Button variant="link">Hesabınızla giriş yapın</Button>
          </Link>
          <Link href="mailto:destek@kafeasist.com">
            <Button variant="link">Destekle iletişime geç</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
