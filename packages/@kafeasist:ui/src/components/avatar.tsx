"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import cn from "../";
import { Skeleton } from "./skeleton";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  alt: string;
  src?: string;
  size?: number;
  placeholder?: string;
}

export function Avatar({ className, size = 40, ...props }: AvatarProps) {
  const [loading, setLoading] = React.useState(true);

  const handleLoadingStatusChange = (
    status: AvatarPrimitive.ImageLoadingStatus,
  ) => {
    if (status === "loading") setLoading(true);
    else setLoading(false);
  };

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        className,
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      <AvatarPrimitive.Image
        onLoadingStatusChange={handleLoadingStatusChange}
        src={props.src}
        alt={props.alt}
        className="aspect-square h-full w-full object-cover"
      />
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
        {loading ? <Skeleton className="h-full w-full" /> : props.placeholder}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
