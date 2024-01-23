"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full border border-border bg-success",
  {
    variants: {
      variant: {
        default: "bg-muted",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 rounded-full transition-all",
  {
    variants: {
      variant: {
        default: "bg-muted-foreground",
        success: "bg-success-foreground",
        warning: "bg-warning-foreground",
        error: "bg-error-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  value?: number;
}

export function Progress({
  className,
  value,
  variant,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={progressVariants({ variant, className })}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={progressIndicatorVariants({ variant })}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
