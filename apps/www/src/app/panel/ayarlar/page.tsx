import * as React from "react";

import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "~/components/panel/inner-title";

export default function Ayarlar() {
  return (
    <>
      <InnerTitle
        title="Ayarlar"
        subtitle="Buradan şirketinin ayarlarını değiştirebilirsin."
      />
      <Separator className="my-6 w-full" />
    </>
  );
}
