import { useContext } from "react";

import { ProductContext } from "~/context/ProductContext";

export const useProduct = () => {
  return (
    useContext(ProductContext) ||
    (() => {
      throw new Error("useProduct must be used within a ProductProvider");
    })()
  );
};
