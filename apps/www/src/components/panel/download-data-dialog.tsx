import { Calendar } from "../ui/calendar";
import { addDays } from "date-fns";
import { tr } from "date-fns/locale";
import { Download } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export const DownloadDataDialog = ({
  setDialog,
}: {
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  return (
    <DialogContent className="flex flex-col items-center">
      <DialogHeader>
        <DialogTitle className="text-center">Verilerimi indir</DialogTitle>
        <DialogDescription className="text-center">
          Şirketinizin veritabanımızdaki verilerini CSV formatında indirin
        </DialogDescription>
      </DialogHeader>
      <Calendar
        initialFocus
        mode="range"
        locale={tr}
        defaultMonth={date?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={1}
        disabled={{ after: new Date() }}
      />
      <DialogFooter>
        <Button size="sm" onClick={() => setDialog(false)}>
          <Download className="mr-2 h-4 w-4" />
          İndir
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
