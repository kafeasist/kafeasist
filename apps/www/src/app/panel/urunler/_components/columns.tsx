"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

import { Product } from "@kafeasist/db";

import { formatMoney } from "~/utils/format-money";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "imageUrl",
    header: "Fotoğraf",
    cell: ({ row }) => {
      return (
        <div className="relative">
          <Image
            src={row.getValue("imageUrl")}
            alt={row.getValue("name")}
            fill
            className="rounded-lg"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "İsim",
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "price",
    header: "Fiyat",
    cell: ({ row }) => {
      return <span>{formatMoney(row.getValue("price"))} ₺</span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
