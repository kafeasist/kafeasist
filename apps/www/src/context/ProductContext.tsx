import React from "react";
import { Product } from "@prisma/client";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";

import { useCompany } from "~/hooks/use-company";
import { api } from "~/utils/api";

type ProductContextType = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  fetchAllProducts: () => UseTRPCQueryResult<any, any>;
};

export const ProductContext = React.createContext<ProductContextType | null>(
  null,
);

type ProductProviderProps = {
  children?: React.ReactNode;
};

const ProductProvider = ({ children }: ProductProviderProps) => {
  const [currentProducts, setCurrentProducts] = React.useState<Product[]>([]);
  const { selectedCompany } = useCompany();

  const setProducts = React.useCallback(
    (categories: Product[]) => setCurrentProducts(categories),
    [currentProducts],
  );

  const addProduct = React.useCallback(
    (product: Product) => {
      setCurrentProducts((currentProducts) => {
        if (currentProducts === null) return [product];
        return [...currentProducts, product];
      });
    },
    [currentProducts],
  );

  const removeProduct = React.useCallback(
    (productId: number) => {
      setCurrentProducts((currentProducts) => {
        if (currentProducts === null) return [];
        return currentProducts.filter((c) => c.id !== productId);
      });
    },
    [currentProducts],
  );

  const fetchAllProducts = React.useCallback(() => {
    const companyId = selectedCompany?.id ?? -1;

    return api.product.getAll.useQuery(
      { companyId },
      {
        enabled: currentProducts.length == 0 && companyId !== -1,
        onSuccess: (data) => {
          if (data.products) setCurrentProducts(data.products!);
        },
      },
    );
  }, [selectedCompany, currentProducts]);

  return (
    <ProductContext.Provider
      value={{
        products: currentProducts,
        setProducts,
        addProduct,
        removeProduct,
        fetchAllProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
