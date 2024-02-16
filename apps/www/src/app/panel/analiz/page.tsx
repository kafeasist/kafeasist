import * as React from "react";

import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "../_components/inner-title";

export default function Analiz() {
  return (
    <>
      <InnerTitle
        title="Analiz"
        subtitle="Buradan şirketinin analizlerini inceleyebilir ve yeni analizler oluşturabilirsin."
      />
      <Separator className="my-6 w-full" />
    </>
  );
}
