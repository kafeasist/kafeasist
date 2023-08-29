import { Building2, Castle, Home } from "lucide-react";

import { Plan } from "@kafeasist/api";

export const plans: {
  id: Plan;
  name: string;
  description: string;
  companies: string;
  users: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "FREE",
    name: "Küçük İşletme",
    description: "Ücretsiz",
    companies: "1",
    users: "10",
    icon: <Home className="h-4 w-4 text-muted-foreground" />,
  },
  {
    id: "PRO",
    name: "Pro",
    description: "₺199,99/ay",
    companies: "3",
    users: "50",
    icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
  },
  {
    id: "ENTERPRISE",
    name: "Kurumsal",
    description: "₺499,99/ay",
    companies: "sınırsız",
    users: "sınırsız",
    icon: <Castle className="h-4 w-4 text-muted-foreground" />,
  },
];
