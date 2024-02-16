"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LogIn, RotateCw } from "lucide-react";
import { toast } from "sonner";

import { Button, Spinner } from "@kafeasist/ui";

import { api } from "~/utils/api";
import { AuthWrapper } from "../_components/wrapper";

function Footer() {
  return (
    <>
      <p className="text-sm">
        Aman şirket sensiz kalmasın!{" "}
        <Link href="/panel" className="font-bold text-link underline">
          Panele geri dön
        </Link>
      </p>
    </>
  );
}

export default function VerifyEmail() {
  const [tryAgain, setTryAgain] = React.useState(false);
  const [tooLong, setTooLong] = React.useState(false);
  const [clickedTooLong, setClickedTooLong] = React.useState(false);

  const { get } = useSearchParams();

  const token = get("token");

  const { mutateAsync, isPending, data } = api.user.verifyEmail.useMutation();

  function verify() {
    const timeout = setTimeout(() => setTooLong(true), 5 * 1000);

    if (!token) return window.location.replace("/giris");

    mutateAsync(
      { token },
      {
        onSuccess: (data) => {
          if (!data.error) toast.success(data.message);
          else toast.error(data.message);
          setTryAgain(false);
          setTooLong(false);
          clearTimeout(timeout);
        },
        onError: (error) => {
          toast.error(error.message);
          setTryAgain(false);
          setTooLong(false);
          clearTimeout(timeout);
        },
      },
    );
  }

  React.useLayoutEffect(() => {
    let mounted = true;

    if (!mounted) return;

    verify();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthWrapper title="E-postanı doğrula" footer={<Footer />}>
      {data?.error || tryAgain ? (
        <div className="space-y-6">
          <div className="text-center">
            <p>Üzgünüz, kafeasist hesabını doğrulayamadık! 😢</p>
            <p>{data?.message}</p>
          </div>
          <Button
            className="w-full"
            loading={isPending}
            onClick={() => {
              setTryAgain((state) => (state = true));
              verify();
            }}
          >
            <RotateCw className="mr-2 h-4 w-4" /> Tekrar dene
          </Button>
        </div>
      ) : data?.error === false ? (
        <div className="flex flex-col items-center space-y-6 text-center">
          <p>
            🎉 Teşekkürler! E-postan başarıyla doğrulandı. Artık
            kafeasist&apos;i doya doya kullanabilirsin. 🥳
          </p>

          <Link href="/panel" className="w-full">
            <Button className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Panele dön
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Spinner />
            <p>
              Biz kafeasist hesabını doğrularken biraz bekle. Hesabının üzerinde
              çalışıyoruz 🛠️
            </p>
          </div>
          {tooLong && (
            <Button
              className="w-full"
              loading={clickedTooLong ? isPending : false}
              onClick={() => {
                setClickedTooLong(true);
              }}
            >
              <RotateCw className="mr-2 h-4 w-4" /> Uzun mu sürüyor? Tekrar dene
            </Button>
          )}
        </div>
      )}
    </AuthWrapper>
  );
}
