"use client";

import React from "react";
import Link from "next/link";

import { Alert, type AlertProps } from "@kafeasist/ui";

import { useSession } from "~/hooks/use-session";

export const Alerts = () => {
  const { session } = useSession();

  const alerts: (AlertProps & { show: boolean })[] = [
    {
      show: !session?.emailVerified,
      variant: "error",
      title: "Hesabınızı doğrulayın!",
      description:
        "E-postanızdaki bağlantıya tıklayarak kafeasist hesabınızı doğrulayın",
      action: (
        <Link
          href="/panel/profil"
          className="text-xs font-bold text-error-foreground underline"
        >
          Doğrulama bağlantısını tekrar gönder {"->"}
        </Link>
      ),
      closable: false,
    },
    {
      show: true,
      variant: "warning",
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
    },
  ];

  return (
    <div className="space-y-4">
      {alerts
        .filter((alert) => alert.show === true)
        .map((alert, index) => (
          <Alert key={index} {...alert} />
        ))}
    </div>
  );
};
