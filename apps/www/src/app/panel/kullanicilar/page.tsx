import * as React from "react";

import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "~/components/panel/inner-title";

export default function Kullanicilar() {
  return (
    <>
      <InnerTitle
        title="Kullanıcılar"
        subtitle="Buradan şirketdeki kullanıcıları düzenleyebilir ve kontrol edebilirsin."
      />
      <Separator className="my-6 w-full" />
    </>
  );
}
