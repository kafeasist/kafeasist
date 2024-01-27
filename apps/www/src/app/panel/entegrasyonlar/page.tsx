import * as React from "react";

import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "~/components/panel/inner-title";

export default function Entegrasyonlar() {
  return (
    <>
      <InnerTitle
        title="Entegrasyonlar"
        subtitle="Buradan şirketinin entegrasyonlarını kontrol edebilirsin."
      />
      <Separator className="my-6 w-full" />
    </>
  );
}
