import { useSession } from "./useSession";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useProtected = () => {
  const { session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session && status !== "loading") router.push("/giris");
    else setLoading(false);
  }, [status]);

  return { loading, setLoading, session };
};
