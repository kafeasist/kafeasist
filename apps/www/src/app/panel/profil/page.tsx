import * as React from "react";
import { Suspense } from "react";

import { Separator, Spinner } from "@kafeasist/ui";

import { InnerTitle } from "../_components/inner-title";
import { Appearance } from "./_components/appearance";
import { Billing } from "./_components/billing";
import { Password } from "./_components/password";
import { PersonalInfo } from "./_components/personal-info";
import { Security } from "./_components/security";

export default function Profile() {
  return (
    <>
      <InnerTitle
        title="Profil"
        subtitle="Hesap bilgilerinizi ve ayarlarınızı yönetin."
      />
      <Separator className="my-6 w-full" />
      <div className="space-y-6">
        <Suspense fallback={<Spinner />}>
          <Appearance />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <PersonalInfo />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <Password />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <Security />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <Billing />
        </Suspense>
      </div>
    </>
  );
}
