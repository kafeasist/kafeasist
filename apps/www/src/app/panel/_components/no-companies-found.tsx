import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button, cn } from "@kafeasist/ui";

interface NoCompaniesFoundProps extends React.HTMLAttributes<HTMLDivElement> {}

export function NoCompaniesFound({
  className,
  ...props
}: NoCompaniesFoundProps) {
  return (
    <div
      className={cn(
        "mt-12 flex flex-col items-center justify-center space-y-5 rounded-lg",
        className,
      )}
      {...props}
    >
      <Image
        src="/company.gif"
        alt="No company found GIF"
        width={300}
        height={300}
      />
      <div>
        <div className="mb-5 space-y-1 text-center">
          <h2 className="text-lg font-bold">Hiçbir şirketiniz bulunmuyor</h2>
          <p className="text-sm">
            İlk şirketinizi oluşturarak kafeasist maceranıza başlayabilirsiniz.
          </p>
        </div>
        <Link href="/panel/sirketlerim/olustur">
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Şirket oluştur
          </Button>
        </Link>
      </div>
    </div>
  );
}
