import { Company } from "@prisma/client";
import React from "react";
import { api } from "~/utils/api";

type CompanyContextType = {
  companies: Company[] | null;
  setCompanies: (companies: Company[]) => void;
  addCompany: (company: Company) => void;
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company) => void;
  loading: boolean;
};

export const CompanyContext = React.createContext<CompanyContextType | null>(
  null,
);

type CompanyProviderProps = {
  children?: React.ReactNode;
};

const CompanyProvider = ({ children }: CompanyProviderProps) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentCompanies, setCurrentCompanies] = React.useState<
    Company[] | null
  >(null);
  const [selectedCompany, setSelectedCompanyState] =
    React.useState<Company | null>(null);

  const setCompanies = React.useCallback(
    (companies: Company[]) => setCurrentCompanies(companies),
    [currentCompanies],
  );

  const addCompany = React.useCallback(
    (company: Company) => {
      setCurrentCompanies((currentCompanies) => {
        if (currentCompanies === null) return [company];
        return [...currentCompanies, company];
      });
    },
    [currentCompanies],
  );

  const setSelectedCompany = React.useCallback(
    (company: Company) => {
      setSelectedCompanyState(company);
      console.log(company.id);

      localStorage.setItem("company", JSON.stringify(company.id));
    },
    [selectedCompany],
  );

  api.company.get.useQuery(undefined, {
    enabled: !currentCompanies,
    onSuccess: (data) => {
      setCurrentCompanies(data);
      if (!data) return;

      const company = localStorage.getItem("company");
      if (!data[0]) {
        setLoading(false);
        return;
      }

      if (isNaN(Number(company))) {
        setSelectedCompany(data[0]);
        setLoading(false);
        return;
      }

      const selectedCompany = data.find((c) => c.id === Number(company));
      if (selectedCompany === undefined) {
        setSelectedCompany(data[0]);
        setLoading(false);
        return;
      }

      setSelectedCompany(selectedCompany);
      setLoading(false);
    },
  });

  return (
    <CompanyContext.Provider
      value={{
        companies: currentCompanies,
        setCompanies,
        addCompany,
        selectedCompany,
        setSelectedCompany,
        loading,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
