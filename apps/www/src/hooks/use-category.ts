import { useContext } from "react";

import { CategoryContext } from "~/context/CategoryContext";

export const useCategory = () => {
  return (
    useContext(CategoryContext) ||
    (() => {
      throw new Error("useCategory must be used within a CategoryProvider");
    })()
  );
};
