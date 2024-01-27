"use client";

import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "~/components/panel/inner-title";

export default function CreateCompany() {
  return (
    <>
      <InnerTitle
        title="Şirket oluştur"
        subtitle="Yeni bir şirket oluştur ve yönetmeye başla."
      />
      <Separator className="my-6 w-full" />
    </>
  );
}
