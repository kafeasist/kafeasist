import { useState } from "react";
import { LucideIcon, MoreHorizontal, Pencil, Trash, View } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCategory } from "~/hooks/use-category";
import { EditProductDialog } from "./edit-product-dialog";
import { RemoveProductDialog } from "./remove-product-dialog";

const MenuItem = (props: {
  icon: LucideIcon;
  name: string;
  action?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <DropdownMenuItem
      className="hover:cursor-pointer"
      onClick={() => (props.action ? props.action(true) : null)}
    >
      <props.icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
      {props.name}
    </DropdownMenuItem>
  );
};

export function DataTableRowActions({
  product,
}: {
  product: {
    id: number;
    categoryId: number;
    name: string;
    description: string;
    price: number;
  };
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { categories } = useCategory();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Menüyü aç</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          <MenuItem icon={View} name="Görüntüle" />
          <MenuItem icon={Pencil} name="Düzenle" action={setEditDialogOpen} />
          <DropdownMenuSeparator />
          <MenuItem icon={Trash} name="Sil" action={setDeleteDialogOpen} />
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <RemoveProductDialog
          setDialog={setDeleteDialogOpen}
          productId={product.id!}
        />
      </Dialog>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <EditProductDialog
          setDialog={setEditDialogOpen}
          product={product}
          categories={categories}
        />
      </Dialog>
    </>
  );
}
