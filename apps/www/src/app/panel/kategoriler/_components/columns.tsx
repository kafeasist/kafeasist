"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Category } from "@kafeasist/db";

import { CellAction } from "./cell-action";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "İsim",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
