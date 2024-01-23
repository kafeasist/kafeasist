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
      src="/logo/plain.png"
      alt="kafeasist Logo"
      width={width ?? 70}
      height={height ?? 70}
      priority
      className={className}
    />
  );
}
