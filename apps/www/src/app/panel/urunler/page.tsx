import * as React from "react";

import { Product } from "@kafeasist/db";
import { Separator } from "@kafeasist/ui";

import { InnerTitle } from "../_components/inner-title";
import { ProductsTable } from "./_components/products-table";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    categoryId: 1,
    categoryName: "Category 1",
    createdAt: new Date(),
    description: "Description 1",
    imageUrl: "https://via.placeholder.com/150",
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    categoryId: 2,
    categoryName: "Category 2",
    createdAt: new Date(),
    description: "Description 2",
    imageUrl: "https://via.placeholder.com/150",
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    categoryId: 3,
    categoryName: "Category 3",
    createdAt: new Date(),
    description: "Description 3",
    imageUrl: "https://via.placeholder.com/150",
    updatedAt: new Date(),
  },
];

export default async function Urunler() {
  // TODO: Get products from API

  return (
    <>
      <InnerTitle
        title="Ürünler"
        subtitle="Buradan şirketinin ürünlerini düzenleyebilir ve kontrol edebilirsin."
      />
      <Separator className="my-6 w-full" />
      <React.Suspense>
        <ProductsTable data={mockProducts} totalData={mockProducts.length} />
      </React.Suspense>
    </>
  );
}
