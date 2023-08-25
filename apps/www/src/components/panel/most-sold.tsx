import { BarList } from "@tremor/react";
import { Info } from "lucide-react";

const InfoIcon = () => (
  <Info className="mr-2 h-5 w-5 text-gray-600 duration-150 hover:cursor-pointer hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400" />
);

const data = [
  {
    name: "Çay",
    value: 456,
    icon: InfoIcon,
  },
  {
    name: "Türk kahvesi",
    value: 351,
    icon: InfoIcon,
  },
  {
    name: "Hamburger menü",
    value: 271,
    icon: InfoIcon,
  },
  {
    name: "Kola",
    value: 191,
    icon: InfoIcon,
  },
  {
    name: "Limonata",
    value: 91,
    icon: InfoIcon,
  },
];

export const MostSold = () => (
  <>
    <div className="flex justify-between">
      <span>Ürün adı</span>
      <span>Satış miktarı</span>
    </div>

    <BarList data={data} className="mt-4" />
  </>
);
