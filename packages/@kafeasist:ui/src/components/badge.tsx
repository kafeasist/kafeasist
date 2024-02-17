import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "..";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-background text-foreground shadow hover:bg-secondary/80",
        secondary:
          "border-transparent bg-secondary text-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
