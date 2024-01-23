"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../";

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: TooltipPrimitive.TooltipContentProps["side"];
  text: React.ReactNode;
  delay?: boolean;
}

export function Tooltip({ className, delay = true, ...props }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root delayDuration={delay ? 700 : 0} {...props}>
        <TooltipPrimitive.Trigger className="cursor-auto">
          {props.children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={props.side ?? "top"}
            sideOffset={3}
            className={cn(
              "z-10 whitespace-nowrap rounded-md border bg-background px-4 py-2 text-xs animate-in fade-in-0 zoom-in-95",
              className,
            )}
          >
            {props.text}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
