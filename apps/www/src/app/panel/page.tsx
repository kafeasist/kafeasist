import React from "react";
import { DollarSign, DownloadCloud } from "lucide-react";

import { Button, cn, Progress, Separator } from "@kafeasist/ui";

import { Alerts } from "~/components/panel/alerts";
import { Filters } from "~/components/panel/filters";
import { InnerTitle } from "~/components/panel/inner-title";
import { formatMoney } from "~/utils/format-money";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  percentage: number;
  progress: number;
  value: number;
  targetText: string;
}

function StatCard({
  className,
  title,
  percentage,
  progress,
  value,
  targetText,
  ...props
}: StatCardProps) {
  let variant;

  if (progress > 60) {
    variant = "success";
  } else if (progress > 30) {
    variant = "warning";
  } else {
    variant = "error";
  }

  return (
    <div
      className={cn(
        "w-full space-y-4 rounded-xl border border-border px-6 py-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4" />
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        <span className="text-xs font-bold text-muted-foreground">
          %{percentage}
        </span>
      </div>
      <div>
        <span className="text-4xl">₺ {formatMoney(value)}</span>
      </div>
      <div className="space-y-2">
        <Progress value={progress} variant={variant as any} />
        <p className="text-sm text-muted-foreground">{targetText}</p>
      </div>
    </div>
  );
}

export default function Panel() {
  return (
    <>
      <div className="space-y-4">
        <Alerts />
        <InnerTitle
          title="Kontrol paneli"
          subtitle="Buradan şirketinin genel istatistiklerini görüp şirketini yönetebilirsin."
        />
      </div>
      <Separator className="my-6 w-full" />
      <div className="grid h-full w-full grid-cols-6 md:gap-3">
        <div className="col-span-6 space-y-4 lg:col-span-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <StatCard
              title="Ciro"
              percentage={13.65}
              value={23177}
              progress={87}
              targetText={`Hedefinize ₺ ${formatMoney(30000 - 23177)} kaldı.`}
            />
            <StatCard
              title="Açık siparişler"
              percentage={-7.65}
              value={1009}
              progress={13}
              targetText={`Masaların %13'ü dolu.`}
            />
          </div>

          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <Filters />
            <Button size="fit">
              <DownloadCloud className="mr-2 h-4 w-4" /> Verilerimi indir
            </Button>
          </div>
        </div>
        <div className="col-span-2"></div>
      </div>
    </>
  );
}
