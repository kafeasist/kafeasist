import * as React from "react";
import { AreaChart } from "@tremor/react";
import { DollarSign, DownloadCloud, Search } from "lucide-react";

import { Button, cn, Input, Progress, Separator, Tooltip } from "@kafeasist/ui";

import { formatMoney } from "~/utils/format-money";
import { InnerTitle } from "../_components/inner-title";
import { Alerts } from "./_components/alerts";
import { Filters } from "./_components/filters";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  percentage: number;
  percentageText: string;
  progress: number;
  value: number;
  targetText: string;
}

function StatCard({
  className,
  title,
  percentage,
  percentageText,
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
        <Tooltip text={percentageText}>
          <span className="text-xs font-bold text-muted-foreground">
            %{percentage}
          </span>
        </Tooltip>
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

interface OrderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  price: number;
  date: Date;
}

function Order({ title, price, date, className, ...props }: OrderProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex justify-between">
        <h3 className="text-sm">{title}</h3>
        <span className="text-right text-sm">₺{price}</span>
      </div>
      <div className="flex justify-end">
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString("tr-TR", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          })}
        </span>
      </div>
    </div>
  );
}

export default function Panel() {
  const chartdata = [
    {
      time: "10:00",
      Ciro: 2890,
      "Açık siparişler": 2338,
    },
    {
      time: "11:00",
      Ciro: 2756,
      "Açık siparişler": 2103,
    },
    {
      time: "12:00",
      Ciro: 3322,
      "Açık siparişler": 2194,
    },
    {
      time: "13:00",
      Ciro: 3470,
      "Açık siparişler": 2108,
    },
    {
      time: "14:00",
      Ciro: 3475,
      "Açık siparişler": 1812,
    },
    {
      time: "15:00",
      Ciro: 3129,
      "Açık siparişler": 1726,
    },
    {
      time: "16:00",
      Ciro: 2890,
      "Açık siparişler": 2338,
    },
    {
      time: "17:00",
      Ciro: 2756,
      "Açık siparişler": 2103,
    },
    {
      time: "18:00",
      Ciro: 3322,
      "Açık siparişler": 2194,
    },
    {
      time: "19:00",
      Ciro: 3470,
      "Açık siparişler": 2108,
    },
    {
      time: "20:00",
      Ciro: 3475,
      "Açık siparişler": 1812,
    },
    {
      time: "21:00",
      Ciro: 3129,
      "Açık siparişler": 1726,
    },
  ];

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
              percentageText="Düne göre artış"
              value={23177}
              progress={87}
              targetText={`Hedefinize ₺ ${formatMoney(30000 - 23177)} kaldı.`}
            />
            <StatCard
              title="Açık siparişler"
              percentage={-7.65}
              percentageText="Düne göre düşüş"
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

          <div className="flex flex-col space-y-1">
            <h2 className="text-lg font-bold">Şirket istatistikleri</h2>
            <p className="text-sm text-muted-foreground">
              Şirketinizin seçtiğiniz aralıktaki ciro istatistikleri
            </p>
          </div>
          <AreaChart
            className="h-80 w-full pt-4"
            data={chartdata}
            index="time"
            showLegend={false}
            yAxisWidth={65}
            categories={["Ciro", "Açık siparişler"]}
            colors={["indigo", "rose"]}
          />
        </div>
        <div className="col-span-6 lg:col-span-2">
          <div className="space-y-4">
            <Input
              icon={<Search className="h-4 w-4 opacity-50" />}
              placeholder="Ara..."
            />
            <div className="h-full space-y-4 rounded-xl border border-border px-6 py-4">
              <h2 className="font-bold">Son siparişler</h2>
              <Separator className="w-full" />
              <Order
                title="Masa 1"
                price={273.98}
                date={new Date(2024, 5, 17, 17, 35)}
              />
              <Order
                title="Masa 2"
                price={151.99}
                date={new Date(2024, 5, 17, 17, 32)}
              />
              <Order
                title="Masa 8"
                price={1170.5}
                date={new Date(2024, 5, 17, 16, 57)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
