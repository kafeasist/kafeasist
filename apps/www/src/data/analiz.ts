import { CheckCircle2, Loader, Brain, BarChart } from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Hatalı",
  },
  {
    value: "feature",
    label: "Özellik",
  },
  {
    value: "documentation",
    label: "Dokümantasyon",
  },
];

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
