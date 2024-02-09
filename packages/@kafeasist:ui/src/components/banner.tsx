"use client";

import * as React from "react";
import { Dot, X } from "lucide-react";

import { cn } from "..";

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  closable?: boolean;
}

export function Banner({
  className,
  icon,
  title,
  subtitle,
  action,
  closable = true,
  ...props
}: BannerProps) {
  const [closed, setClosed] = React.useState(false);

  if (closed) return null;

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between px-8 py-2",
        className,
      )}
      {...props}
    >
      <div />
      <div className="flex flex-col items-center justify-center gap-3 text-center md:flex-row">
        <div className="flex items-center space-x-3">
          {icon}
          <span className="text-sm font-bold">{title}</span>
        </div>
        {subtitle && <Dot className="h-4 w-4" />}
        <span className="text-sm">{subtitle}</span>
        {action && <Dot className="h-4 w-4" />}
        {action}
      </div>
      {closable ? (
        <X
          className="h-5 w-5 rounded-md p-0.5 duration-150 hover:bg-foreground/10"
          onClick={() => setClosed(true)}
        />
      ) : (
        <div />
      )}
    </div>
  );
}
