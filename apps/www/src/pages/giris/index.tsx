import { RouterInputs } from "@kafeasist/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "~/components/ui/Input/input";
import { H1 } from "~/components/ui/Typography/h1";
import { H3 } from "~/components/ui/Typography/h3";
import { Lead } from "~/components/ui/Typography/lead";
import { Muted } from "~/components/ui/Typography/muted";
import { BackButton } from "~/components/ui/back-button";
import { Button } from "~/components/ui/button";
import { Logo } from "~/components/ui/logo";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { useSession } from "~/hooks/use-session";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";

type LoginInputs = RouterInputs["auth"]["login"];

const LoginForm = () => {
  const { push } = useRouter();
  const { toast } = useToast();
  const { setSession } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInputs>();
  const [loading, setLoading] = useState<boolean>(false);

  const login = api.auth.login.useMutation();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setLoading(true);
    const response = await login.mutateAsync(data);
    if (response.success) {
      setSession(response.session);
      push("/panel");
    } else {
      response.fields.forEach((field) => {
        setError(field, { message: response.message });
      });

      toast({
        title: "Giriş başarısız",
        description: response.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="m-auto w-full space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="E-posta"
          {...register("email", { required: true })}
          className={
            errors.email && errors.password
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
        {errors.email && errors.password && (
          <p className="text-left text-xs text-muted-foreground text-red-500">
            {errors.email.type === "required"
              ? "Lütfen e-posta adresinizi giriniz"
              : errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Parola"
          {...register("password", { required: true })}
          className={
            errors.email && errors.password
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
        {errors.email && errors.password && (
          <p className="text-left text-xs text-muted-foreground text-red-500">
            {errors.password.type === "required"
              ? "Lütfen parolanızı giriniz"
              : errors.password.message}
          </p>
        )}
      </div>
      <Button type="submit" className="min-w-full" disabled={loading}>
        {loading ? <Spinner /> : "Giriş yap"}
      </Button>
    </form>
  );
};

const Login = () => {
  return (
    <>
      <div className="absolute flex w-screen justify-between p-8">
        <BackButton href="/" />
      </div>
      <div className="absolute top-[120px] flex w-full items-center justify-center">
        <Link href="/">
          <Logo width={200} />
        </Link>
      </div>
      <main className="m-auto flex h-screen max-w-screen-lg items-center text-center">
        <div className="container space-y-6">
          <H1>Giriş yapın</H1>
          <Lead>Mevcut bilgilerinizle kafeasist hesabınıza giriş yapın</Lead>
          <LoginForm />
          <div className="m-auto flex w-full items-center md:w-3/4 lg:w-1/2">
            <Separator className="w-auto grow" />
            <span className="mx-4">veya</span>
            <Separator className="w-auto grow" />
          </div>
          <Link href="/kayit?ref=giris">
            <Button variant="link">Ücretsiz kaydolun</Button>
          </Link>
          <Link href="/sifremi-unuttum?ref=giris">
            <Button variant="link">Şifremi unuttum</Button>
          </Link>
        </div>
        <Separator orientation="vertical" className="hidden h-1/2 md:block" />
        <div className="container hidden flex-col items-center space-y-4 md:flex">
          <img src="foo" alt="Giriş QR kod" />
          <H3>QR kod ile giriş yap</H3>
          <Muted>
            Telefonunuzda kafeasist uygulamanızı açarak bu QR kodu okutup giriş
            yapabilirsiniz
          </Muted>
        </div>
      </main>
    </>
  );
};

export default Login;
