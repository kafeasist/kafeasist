import React from "react";

import { SessionContext } from "~/context/SessionContext";

export function useSession() {
  const context = React.useContext(SessionContext);

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
}
