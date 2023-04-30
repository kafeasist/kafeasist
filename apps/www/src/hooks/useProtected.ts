import { useSession } from "./useSession";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useProtected = () => {
  const { session, status } = useSession();
  const router = useRouter();

  return useEffect(() => {
    if (!session && status !== "loading") router.push("/giris");
  }, [session]);
};
