import React from "react";
import { SessionContext } from "~/context/SessionContext";

export const useSession = () => {
  const sessionContext = React.useContext(SessionContext);

  if (!sessionContext)
    throw new Error("useSession must be used within a SessionProvider");

  return sessionContext;
};
