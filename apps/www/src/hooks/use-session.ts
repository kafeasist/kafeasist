import { useContext } from "react";
import { SessionContext } from "~/context/SessionContext";

export const useSession = () => {
  return (
    useContext(SessionContext) ||
    (() => {
      throw new Error("useSession must be used within a SessionProvider");
    })()
  );
};
