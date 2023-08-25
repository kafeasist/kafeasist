import { useContext } from "react";
import { CompanyContext } from "~/context/CompanyContext";

export const useCompany = () => {
  return (
    useContext(CompanyContext) ||
    (() => {
      throw new Error("useCompany must be used within a CompanyProvider");
    })()
  );
};
