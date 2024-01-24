"use client";

import * as React from "react";

import { cn } from "@kafeasist/ui";

import { CompanySwitcher } from "../company-switcher";
import { Logo } from "../logo";

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function TopBar({ className, ...props }: TopBarProps) {
  return (
    <section
      className={cn(
        "sticky top-0 z-10 w-full border border-border bg-secondary px-4 py-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo width={39} />
          <span className="invisible text-2xl md:visible">kafeasist</span>
        </div>
        <CompanySwitcher />
      </div>
    </section>
  );
}
