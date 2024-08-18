"use client";

import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { AlertTriangle, X } from "lucide-react";

const alertVariants = cva("rounded-xl p-4 space-x-3 relative flex", {
  variants: {
    variant: {
      info: "bg-info text-info-foreground",
      success: "bg-success text-success-foreground",
      warning: "bg-warning text-warning-foreground",
      error: "bg-error text-error-foreground",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  storageKey: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  closable?: boolean;
}

export function Alert({
  className,
  variant,
  storageKey,
  title,
  description,
  action,
  closable = true,
  ...props
}: AlertProps) {
  const [closed, setClosed] = React.useState(false);

  if (closed) return null;

  const handleClose = () => {
    localStorage.setItem(storageKey, "true");

    setClosed(true);
  };

  return (
    <div
      className={alertVariants({
        variant,
        className,
      })}
      {...props}
    >
      <AlertTriangle className="mt-0.5 h-8 w-8 md:h-4 md:w-4" />
      <div className="space-y-1">
        <h2 className="max-w-[80%] text-sm font-bold">{title}</h2>
        <div className="lg:flex lg:items-center lg:space-x-2">
          <p className="text-sm">{description}</p>
          {action}
        </div>
      </div>
      {closable && (
        <X
          className="absolute right-4 top-4 h-5 w-5 rounded-md p-0.5 duration-150 hover:bg-foreground/10"
          onClick={handleClose}
        />
      )}
    </div>
  );
}
