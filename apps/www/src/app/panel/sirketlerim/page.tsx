import * as React from "react";

import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "../_components/inner-title";

export default function Sirketlerim() {
  return (
    <>
      <InnerTitle
        title="Şirketlerim"
        subtitle="Buradan tüm şirketlerinizi yönetebilirsiniz."
      />
      <Separator className="my-6 w-full" />
    </>
  );
}
