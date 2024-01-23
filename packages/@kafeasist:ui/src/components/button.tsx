import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { Spinner } from "./spinner";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-border",
  {
    variants: {
      variant: {
        default: "bg-secondary hover:bg-secondary/90",
        destructive: "bg-error text-error-foreground hover:bg-error/90",
        outline: "bg-background hover:bg-secondary",
        ghost: "hover:bg-secondary",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        fit: "h-full px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export function Button({
  className,
  children,
  variant,
  size,
  loading = false,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={buttonVariants({
        variant,
        size: loading ? "icon" : size,
        className,
      })}
      disabled={loading}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4" /> : children}
    </Comp>
  );
}
