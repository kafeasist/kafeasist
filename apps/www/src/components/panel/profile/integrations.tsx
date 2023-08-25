import { ArrowRight, Plus, X } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/Input/input";
import { cn } from "~/lib/utils";

const Integrations = () => {
  const integrations: {
    title: string;
    description: string;
    image: string;
    isActive: boolean;
  }[] = [
    {
      title: "Yemeksepeti",
      description: "Yemeksepeti üzerinden gelen siparişleri yönet",
      image: "https://via.placeholder.com/150",
      isActive: true,
    },
    {
      title: "Trendyol Yemek",
      description: "Trendyol Yemek üzerinden gelen siparişleri yönet",
      image: "https://via.placeholder.com/150",
      isActive: false,
    },
    {
      title: "Getir Yemek",
      description: "Getir Yemek üzerinden gelen siparişleri yönet",
      image: "https://via.placeholder.com/150",
      isActive: true,
    },
    {
      title: "Migros Yemek",
      description: "Migros Yemek üzerinden gelen siparişleri yönet",
      image: "https://via.placeholder.com/150",
      isActive: false,
    },
    {
      title: "Dijital Menü",
      description:
        "Dijital Menü ile kendi menünüzü oluşturun, QR kod ile müşterilerinize sunun",
      image: "https://via.placeholder.com/150",
      isActive: true,
    },
  ];

  integrations.sort((a, b) => Number(b.isActive) - Number(a.isActive));

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight">Entegrasyonlar</h2>
      <h3 className="text-md mb-4 text-muted-foreground">
        Entegrasyonlarınızı buradan yönetebilirsiniz.
      </h3>
      <Input className="mb-4" type="search" id="search" placeholder="Ara..." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.title}>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <span>{integration.title}</span>
                  <Badge
                    variant="outline"
                    className={cn(!integration.isActive && "invisible")}
                  >
                    Aktif
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {/* TODO: Do it with "next/image" */}
              <img src={integration.image} alt={integration.title} />
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Button variant="link" className="p-0">
                <span className="text-xs text-blue-700 dark:text-blue-400">
                  Detaylı bilgi
                </span>
                <ArrowRight className="ml-1 h-4 w-4 text-blue-700 dark:text-blue-400" />
              </Button>
              <Button
                variant={integration.isActive ? "destructive" : "outline"}
              >
                {integration.isActive ? (
                  <X className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {integration.isActive ? "Kaldır" : "Ekle"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { Integrations };
