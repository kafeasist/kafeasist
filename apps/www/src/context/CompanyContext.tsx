import * as React from "react";

import type { Plan } from "@kafeasist/api";

export type Company = {
  id: number;
  name: string;
  address: string;
  plan: Plan;
  imageUrl: string | null;
};

export type CompanyContextType = {
  company: Company | null;
  setCompany: (company: Company) => void;
};

export const CompanyContext = React.createContext<
  CompanyContextType | undefined
>(undefined);

const setCompany = (company: Company) => {
  localStorage.setItem("selectedCompany", String(company.id));
  window.location.reload();
};

export function CompanyProvider({
  children,
  company,
}: {
  children?: React.ReactNode;
  company?: Company | null;
}) {
  return (
    <CompanyContext.Provider
      value={{
        company: company ?? null,
        setCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
