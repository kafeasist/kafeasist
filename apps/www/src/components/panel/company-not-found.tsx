import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import { CreateCompanyDialog } from "./create-company-dialog";
import Image from "next/image";
import { useState } from "react";
import noCompanyImage from "~/../public/no-company.svg";

export const CompanyNotFound = ({ loading }: { loading: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col items-center justify-center space-y-4 p-14">
        {loading ? (
          <Spinner variant="long" />
        ) : (
          <>
            <Image
              src={noCompanyImage}
              alt="Şirket bulunamadı"
              width={240}
              className="mb-4"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Burası biraz sessiz
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
