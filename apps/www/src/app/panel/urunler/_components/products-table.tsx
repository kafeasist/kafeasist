"use client";

import type { Product } from "@kafeasist/db";
import {
  DataTable,
  DataTableFilterBox,
  DataTableResetFilter,
  DataTableSearch,
} from "@kafeasist/ui";

import { columns } from "./columns";
import {
  CATEGORY_OPTIONS,
  useProductTableFilters,
} from "./use-product-table-filters";

export function ProductsTable({
  data,
  totalData,
}: {
  data: Product[];
  totalData: number;
}) {
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
    <div className="space-y-4 ">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableFilterBox
          filterKey="categories"
          title="Kategoriler"
          options={CATEGORY_OPTIONS}
          setFilterValue={setCategoriesFilter}
          filterValue={categoriesFilter}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
