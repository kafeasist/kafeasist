import { useState } from "react";
import { Category } from "@prisma/client";
import { SubmitHandler, useForm } from "react-hook-form";

import { RouterInputs } from "@kafeasist/api";

import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/Input/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useProduct } from "~/hooks/use-product";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/utils/api";
import { Spinner } from "../../ui/spinner";

type EditProductDialogProps = RouterInputs["product"]["update"];

export const EditProductDialog = ({
  setDialog,
  categories,
  product,
}: {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
  product: {
    id: number;
    categoryId: number;
    name: string;
    description: string;
    price: number;
  };
}) => {
  const [category, setCategory] = useState<number>(product.categoryId);
  const { addProduct, removeProduct } = useProduct();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EditProductDialogProps>();
  const updateProduct = api.product.update.useMutation();

  const onSubmit: SubmitHandler<EditProductDialogProps> = async (data) => {
    data = {
      ...data,
      id: product.id,
      categoryId: category,
      price: Number(data.price) ?? 0,
      pricePennies: Number(data.pricePennies) ?? 0,
    };

    const response = await updateProduct.mutateAsync(data);

    if (response.error) {
      response.fields.forEach((field) => {
        setError(field, { message: response.message });
      });
    } else {
      setDialog(false);
      removeProduct(data.id);
      addProduct(response.product!);
    }

    toast({
      title: response.error ? "HATA" : "BAŞARILI",
      description: response.message,
      variant: response.error ? "destructive" : "default",
    });
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Ürünü düzenle</DialogTitle>
          <DialogDescription>
            {product.name} ürününü düzenleyin
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ürün ismi</Label>
            <Input
              id="name"
              placeholder="Ürün ismi"
              defaultValue={product.name}
              {...register("name")}
              className={
                errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
              }
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-left text-xs text-muted-foreground text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Ürün açıklaması</Label>
            <Input
              id="description"
              placeholder="Ürün açıklaması (opsiyonel)"
              defaultValue={product.description ? product.description : ""}
              {...register("description")}
              className={
                errors.description
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-left text-xs text-muted-foreground text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <div className="w-full space-y-2">
              <Label htmlFor="price">Ürün fiyatı</Label>
              <Input
                id="price"
                type="number"
                placeholder="150"
                defaultValue={Math.floor(product.price / 100)}
                {...register("price")}
                className={
                  errors.price
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.price && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="pricePennies">Ürün fiyatı (kuruş)</Label>
              <Input
                id="pricePennies"
                type="number"
                placeholder="99"
                defaultValue={product.price % 100}
                {...register("pricePennies")}
                className={
                  errors.pricePennies
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.pricePennies && (
                <p className="text-left text-xs text-muted-foreground text-red-500">
                  {errors.pricePennies.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan">Ürün kategorisi</Label>
            <Select
              disabled={isSubmitting}
              defaultValue={String(product.categoryId)}
              onValueChange={(value) => setCategory(parseInt(value))}
            >
              <SelectTrigger
                className={
                  errors.categoryId
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                {...register("categoryId")}
              >
                <SelectValue placeholder="Bir kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem value={String(category.id)} key={category.id}>
                    <span className="font-medium">{category.name}</span>
                    {category.description && (
                      <span className="text-muted-foreground">
                        {" "}
                        - {category.description}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-left text-xs text-muted-foreground text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={() => setDialog(false)}
            type="reset"
          >
            Vazgeç
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : "Devam et"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
