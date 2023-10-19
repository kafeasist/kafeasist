import { useState } from "react";
import { useRouter } from "next/navigation";
import { TabsContent } from "@radix-ui/react-tabs";
import { Plus, Settings } from "lucide-react";

import { Navbar } from "~/components/panel/navbar";
import { CreatePlaceDialog } from "~/components/panel/tables/create-place-dialog";
import { CreateTableDialog } from "~/components/panel/tables/create-table-dialog";
import Place from "~/components/panel/tables/place";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { usePlace } from "~/hooks/use-place";
import { useSession } from "~/hooks/use-session";

const Masalar = () => {
  const { push } = useRouter();
  const { session, status } = useSession();

  const [createDialog, setCreateDialog] = useState(false);
  const [createTableDialog, setCreateTableDialog] = useState(false);

  const { places, fetchAllPlaces, firstPlace } = usePlace();

  const { isLoading: isPlacesLoading } = fetchAllPlaces();

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
      <div className="flex-1 p-8 pt-6">
        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row">
          <h2 className="text-3xl font-bold tracking-tight">Masalar</h2>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Siparişleri buradan girebilir ve yönetebilirsiniz.
        </div>
        <Separator className="mt-6" />
      </div>
      {isPlacesLoading || !firstPlace ? (
        <Spinner />
      ) : (
        <Tabs className="px-10" defaultValue={String(firstPlace?.id)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TabsList className="grid grid-flow-row gap-2 md:grid-flow-col">
                {places.map((place) => (
                  <TabsTrigger value={String(place.id)} key={place.id}>
                    {place.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Dialog
                open={createTableDialog}
                onOpenChange={setCreateTableDialog}
              >
                <Button
                  variant="outline"
                  onClick={() => setCreateTableDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Masa ekle
                </Button>
                <CreateTableDialog setDialog={setCreateTableDialog} />
              </Dialog>
            </div>
            <div className="space-x-2">
              <Button size="icon" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
              <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                <Button onClick={() => setCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Mekan ekle
                </Button>
                <CreatePlaceDialog setDialog={setCreateDialog} />
              </Dialog>
            </div>
          </div>
          {places.map((place) => (
            <TabsContent value={String(place.id)} key={place.id}>
              <Place id={place.id} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default Masalar;
