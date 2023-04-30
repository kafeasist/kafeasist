import { RouterInputs } from "@kafeasist/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "~/components/ui/Input/input";
import { H1 } from "~/components/ui/Typography/h1";
import { Lead } from "~/components/ui/Typography/lead";
import { Muted } from "~/components/ui/Typography/muted";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useSession } from "~/hooks/useSession";
import { useToast } from "~/hooks/useToast";
import { api } from "~/utils/api";

const FirstEmailInput = (props: {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setStage: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <>
      <H1>Hesabınızı oluşturun</H1>
      <Lead>
        E-posta adresinizi girin ve şimdi hesabınızı oluşturmaya başlayın
      </Lead>
      <form
        onSubmit={() => props.setStage(1)}
        className="m-auto w-full space-y-4 md:w-3/4 lg:w-1/2"
      >
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="isim@ornek.com"
            value={props.email}
            onChange={(e) => props.setEmail(e.target.value)}
            required
          />
        </div>
        <Button className="min-w-full">Hesabını oluştur</Button>
      </form>
      <div className="m-auto flex w-full items-center md:w-3/4 lg:w-1/2">
        <Separator className="w-auto grow" />
        <span className="mx-4">veya</span>
        <Separator className="w-auto grow" />
      </div>
      <Link href="/giris">
        <Button variant="link">Hesabınızla giriş yapın</Button>
      </Link>
      <Link href="/sifremi-unuttum">
        <Button variant="link">Şifremi unuttum</Button>
      </Link>
    </>
  );
};

type RegisterInputs = RouterInputs["auth"]["register"];

const RegisterForm = (props: { email: string }) => {
  const router = useRouter();
  const { setSession } = useSession();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const registerApi = api.auth.register.useMutation();

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    const response = await registerApi.mutateAsync(data);

    if (response.success) {
      setSession(response.session);
      router.push("/panel");
    } else {
      response.fields.forEach((field) => {
        setError(field, { message: response.message });
      });

      toast({
        title: "HATA",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <H1>Çok az kaldı</H1>
      <Lead>Bilgilerinizi tamamlayıp hesabınızı oluşturun</Lead>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto w-full space-y-4 md:w-3/4 lg:w-1/2"
      >
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="E-posta"
            defaultValue={props.email}
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
        <div className="flex items-center justify-between space-x-2">
          <div className="w-full space-y-2">
            <Input
              type="text"
              placeholder="İsim"
              {...register("firstName", { required: true })}
              className={
                errors.firstName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {errors.firstName && (
              <p className="text-left text-xs text-muted-foreground text-red-500">
                {errors.firstName.type === "required"
                  ? "Lütfen isminizi giriniz"
                  : errors.firstName.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-2">
            <Input
              type="text"
              placeholder="Soyisim"
              {...register("lastName", { required: true })}
              className={
                errors.lastName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {errors.lastName && (
              <p className="text-left text-xs text-muted-foreground text-red-500">
                {errors.lastName.type === "required"
                  ? "Lütfen soyisminizi giriniz"
                  : errors.lastName.message}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Telefon (5XX-XXX-XXXX)"
            {...register("phone", { required: true })}
            className={
              errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
            }
          />
          {errors.phone && (
            <p className="text-left text-xs text-muted-foreground text-red-500">
              {errors.phone.type === "required"
                ? "Lütfen telefon numaranızı giriniz"
                : errors.phone.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between space-x-2">
          <div className="w-full space-y-2">
            <Input
              type="password"
              placeholder="Parola"
              {...register("password", { required: true })}
              className={
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {errors.password && (
              <p className="text-left text-xs text-muted-foreground text-red-500">
                {errors.password.type === "required"
                  ? "Lütfen parola giriniz"
                  : errors.password.message}
              </p>
            )}
          </div>
          <div className="w-full space-y-2">
            <Input
              type="password"
              placeholder="Parola tekrar"
              {...register("confirmPassword", { required: true })}
              className={
                errors.confirmPassword
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {errors.confirmPassword && (
              <p className="text-left text-xs text-muted-foreground text-red-500">
                {errors.confirmPassword.type === "required"
                  ? "Lütfen parolayı tekrardan giriniz"
                  : errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <Button type="submit" className="min-w-full">
          Hesabını oluştur
        </Button>
      </form>
      <div className="m-auto w-full space-y-6 md:w-3/4 lg:w-1/2">
        <Separator />
        <Muted>
          Hesabınızı oluşturarak{" "}
          <Link
            href="/kullanim-kosullari"
            target="_blank"
            className="text-gray-800 hover:underline"
          >
            kullanım koşullarını
          </Link>{" "}
          ve{" "}
          <Link
            href="/gizlilik-politikasi"
            target="_blank"
            className="text-gray-800 hover:underline"
          >
            gizlilik politikasını
          </Link>{" "}
          kabul etmiş olursunuz.
        </Muted>
      </div>
    </>
  );
};

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [stage, setStage] = useState<number>(0);

  return (
    <main className="flex">
      <div className="h-screen bg-gradient-to-l from-blue-700 via-blue-800 to-gray-900 lg:w-1/2"></div>
      <div className="flex h-screen w-screen flex-col items-center justify-center text-center lg:w-1/2">
        <div className="container space-y-6">
          {stage === 0 ? (
            <FirstEmailInput
              email={email}
              setEmail={setEmail}
              setStage={setStage}
            />
          ) : (
            <RegisterForm email={email} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Register;
