import { Category } from "@kafeasist/db";
import { DataTable } from "@kafeasist/ui";

import { searchParamsCache } from "~/lib/search-params";
import { columns } from "./columns";

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Category 1",
    companyId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Description 1",
    imageUrl: "",
  },
  {
    id: 2,
    name: "Category 2",
    companyId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: "Description 2",
    imageUrl: "",
  },
];

export default async function CategoryListingPage() {
  const page = searchParamsCache.get("sayfa");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("limit");

  const filteredCategories = mockCategories.filter((category) => {
    if (search && !category.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalCategories = filteredCategories.length;
  const categories = filteredCategories.slice(
    (page - 1) * pageLimit,
    page * pageLimit,
  );

  return (
    <DataTable
      columns={columns}
      data={categories}
      totalItems={totalCategories}
    />
  );
}
