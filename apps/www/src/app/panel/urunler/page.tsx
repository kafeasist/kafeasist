import * as React from "react";
import { SearchParams } from "nuqs/parsers";

// import { Product } from "@kafeasist/db";
import { DataTableSkeleton, Separator } from "@kafeasist/ui";

import { searchParamsCache, serialize } from "~/lib/search-params";
import { InnerTitle } from "../_components/inner-title";
import ProductListing from "./_components/product-listing";
import { ProductTableAction } from "./_components/product-table-action";

interface ProductProps {
  searchParams: SearchParams;
}

export default async function Urunler({ searchParams }: ProductProps) {
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });

  return (
    <>
      <InnerTitle
        title="Ürünler"
        subtitle="Buradan şirketinin ürünlerini düzenleyebilir ve kontrol edebilirsin."
      />
      <Separator className="my-6 w-full" />
      <ProductTableAction />
      <br />
      <React.Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
      >
        <ProductListing />
      </React.Suspense>
    </>
  );
}
