"use client";

import * as React from "react";

import { cn } from "..";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  action?: React.ReactNode;
  phone?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, action, value, phone, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
            {icon}
          </div>
        )}
        <input
          className={cn(
            className,
            {
              "ps-9": icon,
              "pe-9": action,
            },
            "block h-8 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50",
          )}
          type={type ?? "text"}
          ref={ref}
          {...props}
          onChange={(e) => {
            if (phone) {
              const input = e.target.value.replace(/\D/g, "");

              if (input.length === 0) e.target.value = "";
              else if (input.length >= 1 && input.length <= 3)
                e.target.value = "(" + input.slice(0, 3);
              else if (input.length >= 3 && input.length <= 6)
                e.target.value =
                  "(" + input.slice(0, 3) + ") " + input.slice(3);
              else if (input.length >= 6 && input.length <= 8)
                e.target.value =
                  "(" +
                  input.slice(0, 3) +
                  ") " +
                  input.slice(3, 6) +
                  " " +
                  input.slice(6);
              else
                e.target.value =
                  "(" +
                  input.slice(0, 3) +
                  ") " +
                  input.slice(3, 6) +
                  " " +
                  input.slice(6, 8) +
                  "-" +
                  input.slice(8, 10);
            }

            props.onChange?.(e);
          }}
        />
        {action && (
          <div className="absolute inset-y-0 end-0 flex items-center pe-3">
            {action}
          </div>
        )}
      </div>
    );
  },
);
