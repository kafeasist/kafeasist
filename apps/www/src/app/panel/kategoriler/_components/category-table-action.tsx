"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button, DataTableSearch } from "@kafeasist/ui";

import { useCategoryTableFilters } from "./use-category-table-filters";

export function CategoryTableAction() {
  const { searchQuery, setSearchQuery, setPage } = useCategoryTableFilters();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <Link href="kategoriler/ekle">
        <Button size="fit">
          <PlusIcon className="mr-2 size-4" /> Kategori ekle
        </Button>
      </Link>
    </div>
  );
}
