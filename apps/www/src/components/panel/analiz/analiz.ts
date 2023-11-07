import { BarChart, Brain, CheckCircle2, Loader } from "lucide-react";

export const statuses = [
  {
    value: "waiting",
    label: "Bekleniyor",
    icon: Loader,
  },
  {
    value: "done",
    label: "Tamamlandı",
    icon: CheckCircle2,
  },
];

export const types = [
  {
    label: "Manuel",
    value: "manual",
    icon: BarChart,
  },
  {
    label: "Yapay Zeka",
    value: "ai",
    icon: Brain,
  },
];
