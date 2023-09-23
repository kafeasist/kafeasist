import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Navbar } from "~/components/panel/navbar";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Tabs, TabsList } from "~/components/ui/tabs";
import { useSession } from "~/hooks/use-session";

const Masalar = () => {
  const { push } = useRouter();
  const { session, status } = useSession();

  if (!session && status === "loading") {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session && status !== "loading") {
    push("/giris");
    return;
  }

  return (
    <div className="flex-col md:flex">
      <Navbar activeTab="tables" />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
          <h2 className="text-3xl font-bold tracking-tight">Masalar</h2>
        </div>
      </div>
      <Tabs className="p-10">
        <div className="flex items-center justify-between">
          <TabsList className="grid gap-2"></TabsList>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Mekan ekle
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default Masalar;
