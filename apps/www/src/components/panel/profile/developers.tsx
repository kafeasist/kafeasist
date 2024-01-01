import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/Input/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { APIType } from "~/data/apiTypes";
import { useToast } from "~/hooks/use-toast";
import { valueFormatter } from "~/utils/value-formatter";

const DeleteKey = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Silmek istediğinizden emin misiniz?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Bu işlem geri alınamaz. Bu API anahtarını silerseniz bu anahtarı
            kullanan uygulamalar çalışmaz ve yeni anahtar oluşturmanız gerekir.
            Devam etmek istiyor musunuz?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
          <AlertDialogAction>Anahtarı sil</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Developers = () => {
  const pricing: {
    title: string;
    type: APIType;
    endpoint: string;
    price: number;
  }[] = [
    {
      title: "Ürün/kategori API",
      type: "CRUD",
      endpoint: "/api",
      price: 0.2,
    },
    {
      title: "Rezervasyon API",
      type: "CRUD",
      endpoint: "/api/reservation",
      price: 0.6,
    },
    {
      title: "AI analiz API",
      type: "AI",
      endpoint: "/api/analiz",
      price: 6,
    },
  ];

  const { toast } = useToast();

  const [isCopiedPublic, setIsCopiedPublic] = useState(false);
  const [isCopiedPrivate, setIsCopiedPrivate] = useState(false);

  // TODO: Switch to real API key
  const publicKey = "PUBLIC_KEY";
  const privateKey = "PRIVATE_KEY";

  const copyPublicKey = () => {
    navigator.clipboard.writeText(publicKey);

    setIsCopiedPublic(true);

    toast({
      title: "API anahtarı kopyalandı",
      description: "Herkese açık anahtarınız panoya kopyalandı.",
    });

    setTimeout(() => {
      setIsCopiedPublic(false);
    }, 2000);
  };

  const copyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey);

    setIsCopiedPrivate(true);

    toast({
      title: "API anahtarı kopyalandı",
      description: "Gizli anahtarınız panoya kopyalandı.",
    });

    setTimeout(() => {
      setIsCopiedPrivate(false);
    }, 2000);
  };

  return (
    <div className="mb-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Geliştiriciler</h2>
        <h3 className="text-md mb-4 text-muted-foreground">
          Geliştiriciler için kafeasist API hakkında bilgiler.
        </h3>
      </div>
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">API</h3>
            <p className="text-md font-bold text-muted-foreground">
              ÖNEMLİ! Lütfen anahtarlarınızı kimseyle paylaşmayın.
            </p>
            <p className="text-sm text-muted-foreground">
              kafeasist API, kafeasist'in tüm özelliklerini kullanmanızı
              sağlayan bir API'dir. API'ye erişmek için bir API anahtarı
              oluşturmanız gerekmektedir. API anahtarınızı oluşturmak için
              aşağıdaki butona tıklayın. API anahtarınızı oluşturduktan sonra,
              API anahtarınızı kullanarak API'ye erişebilirsiniz.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="public-key">Açık Anahtar</Label>
            <div className="flex w-full items-center space-x-2">
              <Input
                id="public-key"
                defaultValue={"*".repeat(publicKey.length)}
                type="password"
                disabled
              />
              <Button variant="outline" size="icon" onClick={copyPublicKey}>
                {isCopiedPublic ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <DeleteKey />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="private-key">Gizli Anahtar</Label>
            <div className="flex w-full items-center space-x-2">
              <Input
                id="private-key"
                defaultValue={"*".repeat(privateKey.length)}
                type="password"
                disabled
              />
              <Button variant="outline" size="icon" onClick={copyPrivateKey}>
                {isCopiedPrivate ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <DeleteKey />
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight">
            Nasıl kullanırım?
          </h3>
          <p className="text-sm text-muted-foreground">
            API anahtarlarınız ile kafeasist API&apos;a erişebilirsiniz. Nasıl
            kullanılacağına dair detaylı bilgi için{" "}
            <Link href="#" className="text-blue-500 hover:underline">
              dokümantasyona
            </Link>{" "}
            göz atabilirsiniz.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight">Ücretlendirme</h3>
            <p className="text-sm text-muted-foreground">
              API anahtarınız ile yapacağınız her istek için
              ücretlendirilirsiniz. Ücretlendirme detaylarını aşağıdaki tabloda
              bulabilirsiniz. Önceki kullanımlarınızı görmek için{" "}
              <Link
                href="?tab=faturalandirma"
                className="text-blue-500 hover:underline"
              >
                faturalandırma
              </Link>{" "}
              sayfasına göz atabilirsiniz.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Hedef</TableHead>
                <TableHead className="text-right">Ücret</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricing.map((item) => (
                <TableRow key={item.endpoint}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>{item.endpoint}</TableCell>
                  <TableCell className="text-right">
                    {valueFormatter(item.price)} / istek
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export { Developers };
