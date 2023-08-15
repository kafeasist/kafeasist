import { RouterInputs } from "@kafeasist/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "~/components/ui/Input/input";
import { H1 } from "~/components/ui/Typography/h1";
import { Lead } from "~/components/ui/Typography/lead";
import { Button } from "~/components/ui/button";
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
    <main className="flex">
      <div className="h-screen bg-gradient-to-l from-yellow-200 via-green-200 to-green-500 lg:w-1/2"></div>
      <div className="flex h-screen w-screen flex-col items-center justify-center text-center lg:w-1/2">
        <div className="container space-y-6">
          <H1>Giriş yapın</H1>
          <Lead>
            Mevcut kullanıcı bilgilerinizle kafeasist hesabınıza giriş yapın
          </Lead>
          <LoginForm />
          <div className="m-auto flex w-full items-center md:w-3/4 lg:w-1/2">
            <Separator className="w-auto grow" />
            <span className="mx-4">veya</span>
            <Separator className="w-auto grow" />
          </div>
          <Link href="/kayit">
            <Button variant="link">Ücretsiz kaydolun</Button>
          </Link>
          <Link href="/sifremi-unuttum">
            <Button variant="link">Şifremi unuttum</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Login;
