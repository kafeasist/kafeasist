import React from "react";

import { CompanyContext } from "~/context/CompanyContext";

export function useCompany() {
  const context = React.useContext(CompanyContext);

  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }

  return context;
}
