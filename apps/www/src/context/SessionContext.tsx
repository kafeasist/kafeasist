import { Session } from "@kafeasist/auth";
import React from "react";
import { api } from "~/utils/api";

type SessionContextType = {
  session: Session | null;
  setSession: (session: Session) => void;
  status: "loading" | "authenticated" | "unauthenticated";
};

export const SessionContext = React.createContext<SessionContextType | null>(
  null,
);

type SessionProviderProps = {
  session: Session | null;
  children?: React.ReactNode;
};

const SessionProvider = ({ session, children }: SessionProviderProps) => {
  const hasInitialSession = session ? true : false;

  const [loading, setLoading] = React.useState(!hasInitialSession);
  const [currentSession, setSession] = React.useState<Session | null>(
    hasInitialSession ? session : null,
  );

  // TODO: Lower the queries hit on the database
  api.auth.getSession.useQuery(undefined, {
    onSuccess: (data) => {
      if (data) setSession(data);
      setLoading(false);
    },
    onError: () => setLoading(false),
  });

  return (
    <SessionContext.Provider
      value={{
        session: currentSession,
        setSession,
        status: loading
          ? "loading"
          : currentSession
          ? "authenticated"
          : "unauthenticated",
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
