import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import { CreateCompanyDialog } from "./createCompanyDialog";
import { useState } from "react";

export const CompanyNotFound = ({ loading }: { loading: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col items-center justify-center space-y-4 p-14">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Size ait bir şirket bulunamadı.
              </h2>
              <p className="text-sm text-muted-foreground">
                Hemen bir şirket oluşturun ve satışlarınızı takip edin. 🚀
              </p>
            </div>

            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              Şirket oluştur
            </Button>
          </>
        )}
      </div>
      <CreateCompanyDialog setDialog={setOpen} />
    </Dialog>
  );
};
