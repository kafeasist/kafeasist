import * as React from "react";

import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "../_components/inner-title";

export default function Urunler() {
  return (
    <>
      <InnerTitle
        title="Ürünler"
        subtitle="Buradan şirketinin ürünlerini düzenleyebilir ve kontrol edebilirsin."
      />
      <Separator className="my-6 w-full" />
    </>
  );
}
