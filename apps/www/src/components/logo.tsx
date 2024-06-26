import * as React from "react";
import Image from "next/image";

import { cn } from "@kafeasist/ui";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width, height }: LogoProps) {
  return (
    <>
      <Image
        src={"/logo/logo_light.svg"}
        alt="kafeasist Logo"
        width={width ?? 70}
        height={height ?? 70}
        className={cn(className, "block dark:hidden")}
        priority
      />
      <Image
        src={"/logo/logo_dark.svg"}
        alt="kafeasist Logo"
        width={width ?? 70}
        height={height ?? 70}
        className={cn(className, "hidden dark:block")}
        priority
      />
    </>
  );
}
