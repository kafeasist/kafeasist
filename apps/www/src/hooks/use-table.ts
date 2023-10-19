import { useContext } from "react";

import { TableContext } from "~/context/TableContext";

export const useTable = () => {
  return (
    useContext(TableContext) ||
    (() => {
      throw new Error("useTable must be used within a TableProvider");
    })()
  );
};
