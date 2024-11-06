"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import {
  Button,
  DataTableFilterBox,
  DataTableResetFilter,
  DataTableSearch,
} from "@kafeasist/ui";

import {
  CATEGORY_OPTIONS,
  useProductTableFilters,
} from "./use-product-table-filters";

export function ProductTableAction() {
  const {
    categoriesFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useProductTableFilters();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey="categories"
        title="Kategori"
        options={CATEGORY_OPTIONS}
        setFilterValue={setCategoriesFilter}
        filterValue={categoriesFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
      <Link href="urunler/ekle">
        <Button size="fit">
          <PlusIcon className="mr-2 size-4" /> Ürün ekle
        </Button>
      </Link>
    </div>
  );
}
