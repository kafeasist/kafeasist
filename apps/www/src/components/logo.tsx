"use client";

import * as React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

import { Spinner } from "@kafeasist/ui";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width, height }: LogoProps) {
  const { theme } = useTheme();

  if (!theme) return <Spinner />;

  if (theme === "dark") {
    <Image
      src={"/logo/logo_dark.svg"}
      alt="kafeasist Logo"
      width={width ?? 70}
      height={height ?? 70}
      priority
      className={className}
    />;
  }

  return (
    <Image
      src={theme === "dark" ? "/logo/logo_dark.svg" : "/logo/logo_light.svg"}
      alt="kafeasist Logo"
      width={width ?? 70}
      height={height ?? 70}
      priority
      className={className}
    />
  );
}
