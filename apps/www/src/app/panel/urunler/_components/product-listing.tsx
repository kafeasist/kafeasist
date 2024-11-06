import { Product } from "@kafeasist/db";
import { DataTable } from "@kafeasist/ui";

import { searchParamsCache } from "~/lib/search-params";
import { columns } from "./columns";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    categoryId: 1,
    categoryName: "Category 1",
    createdAt: new Date(),
    description: "Description 1",
    imageUrl: "",
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
    imageUrl: "",
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
    imageUrl: "",
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: "Product 3",
    price: 300,
    categoryId: 3,
    categoryName: "Category 3",
    createdAt: new Date(),
    description: "Description 3",
    imageUrl: "",
    updatedAt: new Date(),
  },
  {
    id: 5,
    name: "Product 3",
    price: 300,
    categoryId: 3,
    categoryName: "Category 3",
    createdAt: new Date(),
    description: "Description 3",
    imageUrl: "",
    updatedAt: new Date(),
  },
  {
    id: 6,
    name: "Product 3",
    price: 300,
    categoryId: 3,
    categoryName: "Category 3",
    createdAt: new Date(),
    description: "Description 3",
    imageUrl: "",
    updatedAt: new Date(),
  },
  {
    id: 7,
    name: "Product 3",
    price: 300,
    categoryId: 3,
    categoryName: "Category 3",
    createdAt: new Date(),
    description: "Description 3",
    imageUrl: "",
    updatedAt: new Date(),
  },
  {
    id: 8,
    name: "Product 3",
    price: 300,
    categoryId: 3,
    categoryName: "Category 3",
    createdAt: new Date(),
    description: "Description 3",
    imageUrl: "",
    updatedAt: new Date(),
  },
  {
    id: 9,
    name: "Product 3",
    price: 300,
    categoryId: 3,
    categoryName: "Category 3",
    createdAt: new Date(),
    description: "Description 3",
    imageUrl: "",
    updatedAt: new Date(),
  },
];

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  // TODO: Get products from the server

  const page = searchParamsCache.get("sayfa");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("limit");
  const categories = searchParamsCache.get("categories");

  const filteredProducts = mockProducts.filter((product) => {
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (categories && !categories.includes(product.categoryName)) {
      return false;
    }
    return true;
  });

  const totalProducts = filteredProducts.length;
  const products = filteredProducts.slice(
    (page - 1) * pageLimit,
    page * pageLimit,
  );

  return (
    <DataTable columns={columns} data={products} totalItems={totalProducts} />
  );
}
