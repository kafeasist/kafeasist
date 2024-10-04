"use client";

import { useTransition } from "react";
import { Options } from "nuqs";

import { cn } from "../..";
import { Input } from "../input";

interface DataTableSearchProps {
  searchQuery: string;
  setSearchQuery: (
    value: string | ((old: string) => string | null) | null,
    options?: Options<any> | undefined,
  ) => Promise<URLSearchParams>;
  setPage: <Shallow>(
    value: number | ((old: number) => number | null) | null,
    options?: Options<Shallow> | undefined,
  ) => Promise<URLSearchParams>;
}

export function DataTableSearch({
  searchQuery,
  setSearchQuery,
  setPage,
}: DataTableSearchProps) {
  const [isLoading, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setSearchQuery(value, { startTransition });
    setPage(1);
  };

  return (
    <Input
      placeholder="Ürün ara..."
      value={searchQuery ?? ""}
      onChange={(e) => handleSearch(e.target.value)}
      className={cn("w-full md:max-w-sm", isLoading && "animate-pulse")}
    />
  );
}
