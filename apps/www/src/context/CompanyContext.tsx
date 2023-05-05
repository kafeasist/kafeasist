import { Company } from "@prisma/client";
import React from "react";
import { useSession } from "~/hooks/useSession";

type CompanyContextType = {
  companies: Company[] | null;
  setCompanies: (companies: Company[]) => void;
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
  const { session } = useSession();

  const hasInitialCompanies = React.useMemo(() => {
    if (!session) return false;
    if (!session.companies) return false;
    if (session.companies.length === 0) return false;
    return true;
  }, [session]);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentCompanies, setCurrentCompanies] = React.useState<
    Company[] | null
  >(hasInitialCompanies ? (session?.companies as Company[] | null) : null);
  const [selectedCompany, setSelectedCompanyState] =
    React.useState<Company | null>(null);

  const setCompanies = React.useCallback(
    (companies: Company[]) => setCurrentCompanies(companies),
    [currentCompanies],
  );

  const setSelectedCompany = React.useCallback(
    (company: Company) => {
      setSelectedCompanyState(company);
      localStorage.setItem("company", JSON.stringify(company.id));
    },
    [selectedCompany],
  );

  React.useEffect(() => {
    if (!hasInitialCompanies) return;

    setCurrentCompanies(session?.companies as Company[] | null);
  }, [hasInitialCompanies]);

  React.useEffect(() => {
    const company = localStorage.getItem("company");
    if (currentCompanies === null) return;
    if (!currentCompanies[0]) return;
    if (isNaN(Number(company))) {
      setSelectedCompanyState(currentCompanies[0]);
      setLoading(false);
      return;
    }

    const selectedCompany = currentCompanies.find(
      (c) => c.id === Number(company),
    );

    if (selectedCompany === undefined) {
      setSelectedCompanyState(currentCompanies[0]);
      setLoading(false);
      return;
    }

    setSelectedCompanyState(selectedCompany);
    setLoading(false);
  }, [currentCompanies]);

  return (
    <CompanyContext.Provider
      value={{
        companies: currentCompanies,
        setCompanies,
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
