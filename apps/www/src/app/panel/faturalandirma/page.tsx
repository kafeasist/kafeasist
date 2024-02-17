import * as React from "react";

import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "../_components/inner-title";

export default function Billing() {
  return (
    <>
      <InnerTitle
        title="Faturalandırma"
        subtitle="Faturalandırma işlemlerinizi buradan yönetebilirsiniz."
      />
      <Separator className="my-6 w-full" />
    </>
  );
}
