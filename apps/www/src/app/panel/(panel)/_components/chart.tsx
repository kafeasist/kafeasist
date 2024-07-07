"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@kafeasist/ui";

const chartData = [
  { time: "08:00", ciro: 2890, siparis: 2338 },
  { time: "09:00", ciro: 2890, siparis: 2338 },
  { time: "10:00", ciro: 2890, siparis: 2338 },
  { time: "11:00", ciro: 2756, siparis: 2103 },
  { time: "12:00", ciro: 3322, siparis: 2194 },
  { time: "13:00", ciro: 3470, siparis: 2108 },
  { time: "14:00", ciro: 3475, siparis: 1812 },
  { time: "15:00", ciro: 3129, siparis: 1726 },
  { time: "16:00", ciro: 2890, siparis: 2338 },
  { time: "17:00", ciro: 2756, siparis: 2103 },
  { time: "18:00", ciro: 3322, siparis: 2194 },
  { time: "19:00", ciro: 3470, siparis: 2108 },
  { time: "20:00", ciro: 3475, siparis: 1812 },
  { time: "21:00", ciro: 3129, siparis: 1726 },
];

const chartConfig = {
  ciro: {
    label: "Ciro",
    color: "hsl(var(--chart-1))",
  },
  siparis: {
    label: "Açık siparişler",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Chart() {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillSiparis" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopOpacity={0.8} />
            <stop offset="95%" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillCiro" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopOpacity={0.8} />
            <stop offset="95%" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          dataKey="ciro"
          type="natural"
          fill="url(#fillCiro)"
          fillOpacity={0.4}
          stroke="var(--color-ciro)"
          stackId="a"
        />
        <Area
          dataKey="siparis"
          type="natural"
          fill="url(#fillSiparis)"
          fillOpacity={0.4}
          stroke="var(--color-siparis)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
