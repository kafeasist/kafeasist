import { useState } from "react";
import Image from "next/image";
import { Company } from "@prisma/client";
import { ArrowRight, CheckCircle2, Pencil } from "lucide-react";

import { Session } from "@kafeasist/auth";

import masterCard from "~/../public/mastercard.svg";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import { Dialog } from "~/components/ui/dialog";
import { Input } from "~/components/ui/Input/input";
import { Textarea } from "~/components/ui/textarea";
import { plans } from "~/data/plans";
import { maskEmail } from "~/utils/mask-email";
import { ChangePlanDialog } from "../change-plan-dialog";
import { CompanyNotFound } from "../company-not-found";
import { columns } from "./billing/columns";
import { DataTableToolbar } from "./billing/data-table-toolbar";
import { BillingStatus } from "./billing/schema";

const Billing = ({
  user,
  company,
  loading,
}: {
  user: Session;
  company: Company | null;
  loading: boolean;
}) => {
  const [planDialog, setPlanDialog] = useState<boolean>(false);

  const previousBills: {
    id: string;
    price: number;
    status: BillingStatus;
    date: Date;
  }[] = [
    {
      id: "FTR-240923-0001",
      price: 199.99,
      status: "unpaid",
      date: new Date(2023, 8, 24),
    },
    {
      id: "FTR-240823-0001",
      price: 199.99,
      status: "ongoing",
      date: new Date(2023, 7, 24),
    },
    {
      id: "FTR-240723-0001",
      price: 199.99,
      status: "paid",
      date: new Date(2023, 6, 24),
    },
    {
      id: "FTR-240623-0001",
      price: 199.99,
      status: "paid",
      date: new Date(2023, 5, 24),
    },
    {
      id: "FTR-240523-0001",
      price: 149.99,
      status: "paid",
      date: new Date(2023, 4, 24),
    },
    {
      id: "FTR-240423-0001",
      price: 149.99,
      status: "paid",
      date: new Date(2023, 3, 24),
    },
    {
      id: "FTR-240323-0001",
      price: 149.99,
      status: "paid",
      date: new Date(2023, 2, 24),
    },
    {
      id: "FTR-240223-0001",
      price: 149.99,
      status: "paid",
      date: new Date(2023, 1, 24),
    },
    {
      id: "FTR-240123-0001",
      price: 109.99,
      status: "paid",
      date: new Date(2023, 0, 24),
    },
  ];

  return (
    <div className="mb-8 space-y-8">
      <h2 className="mb-4 text-3xl font-bold tracking-tight">Faturalandırma</h2>
      {company ? (
        <>
          <h3 className="mb-4 text-xl font-bold tracking-tight">Plan</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {plans
              .filter((plan) => plan.id === company.plan)
              .map(
                (plan) => (
                  <Dialog
                    open={planDialog}
                    onOpenChange={setPlanDialog}
                    key={plan.id}
                  >
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle>
                          <div className="flex justify-between">
                            <span>{plan.name}</span>
                            {plan.icon}
                          </div>
                        </CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul>
                          <li className="flex items-center">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            <span className="text-sm">
                              Hesapta toplam <strong>{plan.companies}</strong>{" "}
                              şirket
                            </span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            <span className="text-sm">
                              Şirket başına <strong>{plan.users}</strong>{" "}
                              kullanıcı
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="link"
                          className="p-0"
                          onClick={() => setPlanDialog(true)}
                        >
                          <span className="text-xs text-blue-700 dark:text-blue-400">
                            Planı değiştir
                          </span>
                          <ArrowRight className="ml-1 h-4 w-4 text-blue-700 dark:text-blue-400" />
                        </Button>
                      </CardFooter>
                    </Card>
                    <ChangePlanDialog
                      setDialog={setPlanDialog}
                      company={company}
                    />
                  </Dialog>
                ),
                [],
              )}

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Faturalandırma periyodu</CardTitle>
                <CardDescription>Aylık</CardDescription>
              </CardHeader>
              <CardContent>
                <ul>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      Sonraki ödeme tarihi: <strong>24 Eylül 2023</strong>
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      Yıllık ödeme yaparak <strong>%20</strong> kazanın
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="link" className="p-0">
                  <span className="text-xs text-blue-700 dark:text-blue-400">
                    Periyodu değiştir
                  </span>
                  <ArrowRight className="ml-1 h-4 w-4 text-blue-700 dark:text-blue-400" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          <h3 className="mb-4 text-xl font-bold tracking-tight">
            Fatura bilgileri
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="col-span-1 flex flex-col">
              <div className="mb-2 space-y-1">
                <h4 className="text-md font-bold tracking-tighter">Ad soyad</h4>
                <span className="text-sm text-muted-foreground">
                  Faturada gösterilecek ad soyad
                </span>
              </div>
              <Input
                defaultValue={`${user.firstName} ${user.lastName}`}
                disabled
                placeholder="Ad soyad"
                id="name"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <div className="mb-2 space-y-1">
                <h4 className="text-md font-bold tracking-tighter">E-posta</h4>
                <span className="text-sm text-muted-foreground">
                  Şirketinizin faturalarını göndermek için kullanacağımız
                  e-posta adresi
                </span>
              </div>
              <Input
                defaultValue={maskEmail(user.email)}
                disabled
                placeholder="E-posta"
                id="email"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <div className="mb-2 space-y-1">
                <h4 className="text-md font-bold tracking-tighter">Adres</h4>
                <span className="text-sm text-muted-foreground">
                  Faturanızın gönderileceği adres bilgisi
                </span>
              </div>
              <Textarea
                value={company.address}
                disabled
                placeholder="Adres"
                id="address"
                className="resize-none"
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <div className="mb-2 space-y-1">
                <h4 className="text-md font-bold tracking-tighter">
                  Vergi kodu
                </h4>
                <span className="text-sm text-muted-foreground">
                  Faturanızında gösterilecek vergi kodu
                </span>
              </div>
              <Input
                value={company.taxCode}
                disabled
                placeholder="Vergi kodu"
                id="taxCode"
              />
            </div>
          </div>
          <Button>
            <Pencil className="mr-2 h-4 w-4" /> Düzenle
          </Button>
          <h3 className="mb-4 text-xl font-bold tracking-tight">
            Ödeme bilgileri
          </h3>
          <Card>
            <CardHeader>
              <CardTitle>Kart bilgileri</CardTitle>
              <CardDescription className="flex items-center">
                <Image alt="MasterCard" src={masterCard} width={50} />
                <span>Sonu 4242 ile biten MasterCard</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span className="text-sm">
                    Kartınızın son kullanma tarihi: <strong>**/26</strong>
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span className="text-sm">
                    Kartınızın CVV kodu: <strong>**4</strong>
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="p-0">
                <span className="text-xs text-blue-700 dark:text-blue-400">
                  Kartı değiştir
                </span>
                <ArrowRight className="ml-1 h-4 w-4 text-blue-700 dark:text-blue-400" />
              </Button>
            </CardFooter>
          </Card>
          <h3 className="mb-4 text-xl font-bold tracking-tight">
            Önceki faturalar
          </h3>
          <DataTable
            DataTableToolbar={DataTableToolbar}
            data={previousBills}
            columns={columns}
          />
        </>
      ) : (
        <CompanyNotFound loading={loading} />
      )}
    </div>
  );
};

export { Billing };
