import React from "react";
import { CompanyContext } from "~/context/CompanyContext";

export const useCompany = () => {
  const companyContext = React.useContext(CompanyContext);

  if (!companyContext)
    throw new Error("useSession must be used within a SessionProvider");

  return companyContext;
};
