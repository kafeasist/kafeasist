"use client";

import React from "react";

import { cn } from "@kafeasist/ui";

interface FilterButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function FilterButton({ children, active, ...props }: FilterButtonProps) {
  return (
    <button
      className={cn(
        "w-full rounded-xl px-4 py-2 text-sm text-muted-foreground md:w-auto",
        active && "bg-secondary text-foreground",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface FiltersProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Filters = ({ className, ...props }: FiltersProps) => {
  const [activeFilter, setActiveFilter] = React.useState<
    "today" | "week" | "month"
  >("today");

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-3 sm:flex-row",
        className,
      )}
      {...props}
    >
      <FilterButton
        active={activeFilter === "today"}
        onClick={() => setActiveFilter("today")}
      >
        Bugün
      </FilterButton>
      <FilterButton
        active={activeFilter === "week"}
        onClick={() => setActiveFilter("week")}
      >
        Son 7 gün
      </FilterButton>
      <FilterButton
        active={activeFilter === "month"}
        onClick={() => setActiveFilter("month")}
      >
        Son 30 gün
      </FilterButton>
    </div>
  );
};
