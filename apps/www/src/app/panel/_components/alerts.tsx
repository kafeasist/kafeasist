"use client";

import React from "react";
import Link from "next/link";

import { Alert, type AlertProps } from "@kafeasist/ui";

import { useSession } from "~/hooks/use-session";

export const Alerts = () => {
  const { session } = useSession();

  if (!session) return null;

  const alerts: (AlertProps & { show: boolean })[] = [
    {
      show: !session.emailVerified,
      storageKey: "emailVerified",
      variant: "error",
      title: "Hesabınızı doğrulayın!",
      description:
        "E-postanızdaki bağlantıya tıklayarak kafeasist hesabınızı doğrulayın",
      action: (
        <Link
          href="/panel/profil#guvenlik"
          className="text-xs font-bold text-error-foreground underline"
        >
          Doğrulama bağlantısını tekrar gönder {"->"}
        </Link>
      ),
      closable: false,
    },
    {
      show: !session.twoFA,
      storageKey: "twoFA",
      variant: "warning",
      title: "Hesabınızı koruma altına alın!",
      description:
        "Hesabınızı korumak için iki faktörlü kimlik doğrulamayı etkinleştirin",
      action: (
        <Link
          href="/panel/profil#guvenlik"
          className="text-xs font-bold text-warning-foreground underline"
        >
          Etkinleştir {"->"}
        </Link>
      ),
      closable: true,
    },
  ];

  const wasClosed = (storageKey: string) => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(storageKey) === "true";
  };

  return (
    <div className="mb-4 space-y-4">
      {alerts
        .filter((alert) => alert.show === true && !wasClosed(alert.storageKey))
        .map(({ show, ...alert }, index) => (
          <Alert key={index} {...alert} />
        ))}
    </div>
  );
};
