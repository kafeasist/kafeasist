import { AreaChart } from "@tremor/react";
import { valueFormatter } from "~/utils/value-formatter";

const chartdata = [
  {
    date: "09:00",
    Satışlar: 5542.25,
    Kâr: 554.22,
  },
  {
    date: "10:00",
    Satışlar: 6789,
    Kâr: 678.9,
  },
  {
    date: "11:00",
    Satışlar: 7895.12,
    Kâr: 789.51,
  },
  {
    date: "12:00",
    Satışlar: 9382.69,
    Kâr: 1238.26,
  },
  {
    date: "13:00",
    Satışlar: 10200.25,
    Kâr: 1520.02,
  },
  {
    date: "14:00",
    Satışlar: 4768.09,
    Kâr: 312.8,
  },
  {
    date: "15:00",
    Satışlar: 2341.42,
    Kâr: 123.45,
  },
  {
    date: "16:00",
    Satışlar: 1212.12,
    Kâr: 322.21,
  },
  {
    date: "17:00",
    Satışlar: 666.66,
    Kâr: 221.66,
  },
  {
    date: "18:00",
    Satışlar: 0,
    Kâr: 0,
  },
  {
    date: "19:00",
    Satışlar: 0,
    Kâr: 0,
  },
  {
    date: "20:00",
    Satışlar: 0,
    Kâr: 0,
  },
  {
    date: "21:00",
    Satışlar: 0,
    Kâr: 0,
  },
  {
    date: "22:00",
    Satışlar: 0,
    Kâr: 0,
  },
  {
    date: "23:00",
    Satışlar: 0,
    Kâr: 0,
  },
  {
    date: "00:00",
    Satışlar: 0,
    Kâr: 0,
  },
];

export const HourlySales = () => (
  <AreaChart
    className="mt-4 h-72"
    data={chartdata}
    index="date"
    allowDecimals
    categories={["Satışlar", "Kâr"]}
    colors={["blue", "emerald"]}
    valueFormatter={valueFormatter}
  />
);
