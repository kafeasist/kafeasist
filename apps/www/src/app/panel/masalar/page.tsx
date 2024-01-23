import * as React from "react";

import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "~/components/panel/inner-title";

export default function Masalar() {
  return (
    <>
      <InnerTitle
        title="Masalar"
        subtitle="Buradan şirketinin masalarını düzenleyebilir ve kontrol edebilirsin."
      />
      <Separator className="my-6 w-full" />
    </>
  );
}
