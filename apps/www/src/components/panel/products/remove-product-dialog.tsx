import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Spinner } from "~/components/ui/spinner";
import { useProduct } from "~/hooks/use-product";
import { toast } from "~/hooks/use-toast";
import { api } from "~/utils/api";

export const RemoveProductDialog = ({
  setDialog,
  productId,
}: {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  productId: number;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { removeProduct: removeProductFn } = useProduct();

  const removeProduct = api.product.delete.useMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const response = await removeProduct.mutateAsync({ id: productId });

    if (!response.error) removeProductFn(productId);

    toast({
      title: response.error ? "HATA" : "BAŞARILI",
      description: response.message,
      variant: response.error ? "destructive" : "default",
    });

    setIsSubmitting(false);
    setDialog(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Bu ürünü silmek istediğinize emin misiniz?</DialogTitle>
        <DialogDescription>
          Bu ürünü sildiğinizde geri alamazsınız. Bu ürünün ait olduğu
          siparişler de sonsuza kadar silinecektir.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          disabled={isSubmitting}
          onClick={() => setDialog(false)}
          type="reset"
        >
          Vazgeç
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Sil"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
