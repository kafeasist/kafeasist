import * as React from "react";
import { SearchParams } from "nuqs/parsers";

// import { Category } from "@kafeasist/db";
import { DataTableSkeleton, Separator } from "@kafeasist/ui";

import { searchParamsCache, serialize } from "~/lib/search-params";
import { InnerTitle } from "../_components/inner-title";
import CategoryListing from "./_components/category-listing";
import { CategoryTableAction } from "./_components/category-table-action";

interface CategoryProps {
  searchParams: SearchParams;
}

export default async function Urunler({ searchParams }: CategoryProps) {
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });

  return (
    <>
      <InnerTitle
        title="Kategoriler"
        subtitle="Buradan şirketinin kategorilerini düzenleyebilir ve kontrol edebilirsin."
      />
      <Separator className="my-6 w-full" />
      <CategoryTableAction />
      <br />
      <React.Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
      >
        <CategoryListing />
      </React.Suspense>
    </>
  );
}
