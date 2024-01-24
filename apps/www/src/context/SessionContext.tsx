import * as React from "react";

import { Session } from "@kafeasist/auth";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export type SessionContextType = {
  session: Session | null;
  setSession: (session: Session) => void;
  status: SessionStatus;
};

export const SessionContext = React.createContext<
  SessionContextType | undefined
>(undefined);

export function SessionProvider({
  children,
  session,
  loading,
}: {
  children?: React.ReactNode;
  session?: Session | null;
  loading: boolean;
}) {
  return (
    <SessionContext.Provider
      value={{
        session: session ?? null,
        setSession: () => {},
        status: session
          ? "authenticated"
          : loading
          ? "loading"
          : "unauthenticated",
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
