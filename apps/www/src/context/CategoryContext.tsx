import React from "react";
import { Category } from "@prisma/client";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";

import { useCompany } from "~/hooks/use-company";
import { useProduct } from "~/hooks/use-product";
import { api } from "~/utils/api";

type CategoryContextType = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  removeCategory: (categoryId: number) => void;
  getCategoryById: (categoryId: number) => Category | undefined;
  fetchAllCategories: () => UseTRPCQueryResult<any, any>;
};

export const CategoryContext = React.createContext<CategoryContextType | null>(
  null,
);

type CategoryProviderProps = {
  children?: React.ReactNode;
};

const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const [currentCategories, setCurrentCategories] = React.useState<Category[]>(
    [],
  );
  const { selectedCompany } = useCompany();
  const { products, setProducts } = useProduct();

  const setCategories = React.useCallback(
    (categories: Category[]) => setCurrentCategories(categories),
    [currentCategories],
  );

  const addCategory = React.useCallback(
    (category: Category) => {
      setCurrentCategories((currentCategories) => {
        if (currentCategories === null) return [category];
        return [...currentCategories, category];
      });
    },
    [currentCategories],
  );

  const removeCategory = React.useCallback(
    (categoryId: number) => {
      setCurrentCategories((currentCategories) => {
        if (currentCategories === null) return [];
        return currentCategories.filter((c) => c.id !== categoryId);
      });
      setProducts(products.filter((c) => c.categoryId !== categoryId));
    },
    [currentCategories],
  );

  const getCategoryById = (categoryId: number) => {
    return currentCategories.find((c) => c.id === categoryId);
  };

  const fetchAllCategories = React.useCallback(() => {
    const companyId = selectedCompany?.id ?? -1;

    return api.category.getAll.useQuery(
      { companyId },
      {
        enabled: currentCategories.length == 0 && companyId !== -1,
        onSuccess: (data) => {
          if (data.categories) setCurrentCategories(data.categories!);
        },
      },
    );
  }, [selectedCompany, currentCategories]);

  return (
    <CategoryContext.Provider
      value={{
        categories: currentCategories,
        setCategories,
        addCategory,
        removeCategory,
        getCategoryById,
        fetchAllCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
