import React from "react";
import Link from "next/link";

import { Alert } from "@kafeasist/ui";

export const Alerts = () => {
  const alert = {
    title: "Ürünlerin fiyatına dikkat edin!",
    description:
      "Hamburger menü ve kahvaltı tabağı ürünlerinizin fiyatlarını artırın.",
    action: (
      <Link
        href="/panel/urunler/duzenle?id=31"
        className="text-xs font-bold text-warning-foreground underline"
      >
        Düzenle {"->"}
      </Link>
    ),
    closable: true,
  };

  return <Alert variant="warning" {...alert} />;
};
