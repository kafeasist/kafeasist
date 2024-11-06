import * as React from "react";

import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "../../_components/inner-title";

export default async function Ekle() {
  return (
    <>
      <InnerTitle
        title="Ürün ekle"
        subtitle="Yeni bir ürün eklemek için aşağıdaki formu doldurun."
      />
      <Separator className="my-6 w-full" />
    </>
  );
}
