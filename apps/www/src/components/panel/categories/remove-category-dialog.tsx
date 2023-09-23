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
import { useCategory } from "~/hooks/use-category";
import { toast } from "~/hooks/use-toast";
import { api } from "~/utils/api";

export const RemoveCategoryDialog = ({
  setDialog,
  categoryId,
}: {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  categoryId: number;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { removeCategory: removeCategoryFn } = useCategory();

  const removeCategory = api.category.delete.useMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const response = await removeCategory.mutateAsync({ id: categoryId });

    if (!response.error) removeCategoryFn(categoryId);

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
        <DialogTitle>
          Bu kategoriyi silmek istediğinize emin misiniz?
        </DialogTitle>
        <DialogDescription>
          Bu kategoriyi sildiğinizde geri alamazsınız. Bu kategoriye ait ürünler
          de sonsuza kadar silinecektir.
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
