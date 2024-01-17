import * as React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width, height }: LogoProps) {
  return (
    <Image
      src="/logo/logowithtext.png"
      alt="kafeasist Logo"
      width={width ?? 200}
      height={height ?? 100}
      className={className}
    />
  );
}
