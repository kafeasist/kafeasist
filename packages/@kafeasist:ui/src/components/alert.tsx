"use client";

import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { AlertTriangle, X } from "lucide-react";

const alertVariants = cva("rounded-xl p-4 space-x-3 relative", {
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

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  closable?: boolean;
}

export function Alert({
  className,
  variant,
  title,
  description,
  action,
  closable = true,
  ...props
}: AlertProps) {
  const [closed, setClosed] = React.useState(false);

  return (
    <div
      className={alertVariants({
        variant,
        className,
      })}
      {...props}
      style={{ display: closed ? "none" : "flex" }}
    >
      <AlertTriangle className="mt-0.5 h-8 w-8 md:h-4 md:w-4" />
      <div className="space-y-1">
        <h2 className="max-w-[80%] text-sm font-bold">{title}</h2>
        <div className="md:flex md:items-center md:space-x-2">
          <p className="text-sm">{description}</p>
          {action}
        </div>
      </div>
      {closable && (
        <X
          className="absolute right-4 top-4 h-4 w-4 cursor-pointer"
          onClick={() => setClosed(true)}
        />
      )}
    </div>
  );
}
