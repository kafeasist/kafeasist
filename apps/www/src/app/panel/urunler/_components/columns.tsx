"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

import type { Product } from "@kafeasist/db";

import { CellAction } from "./cell-action";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "photo_url",
    header: "IMAGE",
    cell: ({ row }) => {
      return (
        <div className="relative aspect-square">
          <Image
            src={row.getValue("photo_url")}
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
    header: "NAME",
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
  },
  {
    accessorKey: "price",
    header: "PRICE",
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
