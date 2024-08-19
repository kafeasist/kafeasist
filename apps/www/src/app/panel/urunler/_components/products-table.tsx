"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kafeasist/ui";

export function ProductsTable() {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Resim</span>
            </TableHead>
            <TableHead>İsim</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="hidden md:table-cell">Fiyat</TableHead>
            <TableHead className="hidden md:table-cell">
              Oluşturma tarihi
            </TableHead>
            <TableHead>
              <span className="sr-only">Aksiyonlar</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="hidden sm:table-cell">
              <Image
                alt="Ürün resmi"
                className="aspect-square rounded-md object-cover"
                height="64"
                src="/placeholder.svg"
                width="64"
              />
            </TableCell>
            <TableCell className="font-medium">Limonata</TableCell>
            <TableCell>
              <Badge variant="outline">İçecekler</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">₺499.99</TableCell>
            <TableCell className="hidden md:table-cell">
              12 Temmuz 2023, 10:42
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Düzenle</DropdownMenuItem>
                  <DropdownMenuItem>Sil</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="text-xs text-muted-foreground">
        <strong>32</strong> üründen <strong>1-10</strong> arası gösteriliyor.
      </div>
    </>
  );
}
