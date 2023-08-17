import { DonutChart, Legend } from "@tremor/react";
import { valueFormatter } from "~/utils/value-formatter";

const methods = [
  {
    name: "Kredi kartı",
    sales: 12000,
  },
  {
    name: "Nakit",
    sales: 2000,
  },
];

export const PaymentMethods = () => (
  <div className="block items-center xl:flex">
    <Legend
      categories={["Kredi kartı", "Nakit"]}
      colors={["indigo", "emerald"]}
    ></Legend>
    <DonutChart
      variant="pie"
      data={methods}
      category="sales"
      index="name"
      valueFormatter={valueFormatter}
      colors={["indigo", "emerald"]}
    />
  </div>
);
