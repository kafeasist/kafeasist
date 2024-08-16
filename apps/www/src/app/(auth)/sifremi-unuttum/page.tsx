import Link from "next/link";

import { AuthWrapper } from "../_components/wrapper";
import { ForgotForm } from "./_components/forgot-form";
import { ResetForm } from "./_components/reset-form";

function Footer() {
  return (
    <>
      <p className="text-sm">
        Şifreni hatırladın mı?{" "}
        <Link href="/giris" className="font-bold text-link underline">
          Giriş yap
        </Link>
      </p>
      <p className="text-sm">
        Hesabın yok mu?{" "}
        <Link href="/kayit" className="font-bold text-link underline">
          Hemen oluştur
        </Link>
      </p>
    </>
  );
}

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string;

  return (
    <AuthWrapper title="Hesabının şifresini sıfırla" footer={<Footer />}>
      {!token ? <ForgotForm /> : <ResetForm token={token} />}
    </AuthWrapper>
  );
}
