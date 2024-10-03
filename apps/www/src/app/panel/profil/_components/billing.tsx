"use client";

import Image from "next/image";
import { CardType } from "@prisma/client";
import { CreditCard, Trash } from "lucide-react";

import { Button, Card, CardContent, Spinner } from "@kafeasist/ui";

import { api } from "~/utils/api";

type CardOptions = {
  [key in keyof typeof CardType]: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
};

export function Billing() {
  const { data: creditCard, isPending } = api.creditCard.get.useQuery();

  const CARD_OPTIONS: CardOptions = {
    VISA: {
      src: "/card/visa.svg",
      width: 50,
      height: 50,
      alt: "VISA kart",
    },
    MASTERCARD: {
      src: "/card/mastercard.svg",
      width: 30,
      height: 30,
      alt: "MasterCard kart",
    },
    AMERICAN_EXPRESS: {
      src: "/card/amex.png",
      width: 20,
      height: 20,
      alt: "AMEX kart",
    },
  };

  return (
    <Card id="faturalandirma">
      <div className="space-y-1 p-6">
        <h2 className="font-bold">Faturalandırma</h2>
        <p className="text-sm text-muted-foreground">
          Faturalandırma ayarlarınızı buradan düzenleyebilirsiniz.
        </p>
      </div>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full items-center justify-between space-y-4 rounded-xl border border-border p-6 md:space-y-0">
            <h3 className="flex items-center text-sm font-bold">
              <CreditCard className="mr-2 size-4" /> Mevcut kart
            </h3>
            {isPending ? (
              <Spinner />
            ) : creditCard && creditCard.error ? (
              <>{creditCard.message}</>
            ) : creditCard && creditCard.card ? (
              <div className="items-center justify-between space-y-4 md:flex md:space-y-0">
                <div className="flex items-center space-x-2">
                  <Image
                    alt={CARD_OPTIONS[creditCard.card.type].alt}
                    src={CARD_OPTIONS[creditCard.card.type].src}
                    width={CARD_OPTIONS[creditCard.card.type].width}
                    height={CARD_OPTIONS[creditCard.card.type].height}
                  />
                  <span className="text-sm text-muted-foreground">
                    &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;
                    &bull;&bull;&bull;&bull;{" "}
                    {creditCard.card.cardNumber.slice(12, 16)}
                  </span>
                </div>
                <div className="items-center space-y-2 md:flex md:space-x-2 md:space-y-0">
                  <Button className="w-full md:w-auto">Değiştir</Button>
                  <Button className="w-full md:w-auto" variant="destructive">
                    <Trash className="mr-2 size-4" /> Kaldır
                  </Button>
                </div>
              </div>
            ) : (
              "Bir hata oluştu, lütfen tekrar deneyin."
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
