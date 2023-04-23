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
  console.log(session);

  const hasInitialSession = session !== null;

  const [loading, setLoading] = React.useState(!hasInitialSession);
  const [currentSession, setCurrentSession] = React.useState<Session | null>(
    hasInitialSession ? session : null,
  );

  const setSession = React.useCallback(
    (session: Session) => setCurrentSession(session),
    [currentSession],
  );

  React.useEffect(() => {
    if (hasInitialSession) return;

    const fetchSession = async () => {
      try {
        const session = api.auth.getSession.useQuery();

        if (!session.data) throw new Error("Failed to fetch session");

        setCurrentSession(session.data);
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

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
