"use client";

import * as React from "react";

import { Logo } from "~/components/logo";

export function AuthWrapper({
  children,
  footer,
  title,
}: {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center space-y-3">
        <Logo width={60} />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">{children}</div>
      <div className="space-y-2 text-center">{footer}</div>
    </div>
  );
}
