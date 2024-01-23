import React from "react";
import { AreaChart } from "@tremor/react";
import { DollarSign, DownloadCloud } from "lucide-react";

import { Button, cn, Input, Progress, Separator } from "@kafeasist/ui";

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
      date: "Jan 22",
      SemiAnalysis: 2890,
      "The Pragmatic Engineer": 2338,
    },
    {
      date: "Feb 22",
      SemiAnalysis: 2756,
      "The Pragmatic Engineer": 2103,
    },
    {
      date: "Mar 22",
      SemiAnalysis: 3322,
      "The Pragmatic Engineer": 2194,
    },
    {
      date: "Apr 22",
      SemiAnalysis: 3470,
      "The Pragmatic Engineer": 2108,
    },
    {
      date: "May 22",
      SemiAnalysis: 3475,
      "The Pragmatic Engineer": 1812,
    },
    {
      date: "Jun 22",
      SemiAnalysis: 3129,
      "The Pragmatic Engineer": 1726,
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

          <AreaChart
            className="h-96 w-full"
            data={chartdata}
            index="date"
            yAxisWidth={65}
            categories={["SemiAnalysis", "The Pragmatic Engineer"]}
            colors={["indigo", "cyan"]}
          />
        </div>
        <div className="col-span-2">
          <div className="space-y-4">
            <Input placeholder="Ara..." />
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
