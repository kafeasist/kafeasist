import { useState } from "react";
import { Company } from "@prisma/client";
import { Dialog } from "@radix-ui/react-dialog";
import { CheckCircle2, Pencil, PlusCircle, Trash } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
import { plans } from "~/data/plans";
import { prettifyPhone } from "~/utils/prettify-phone";
import { CompanyNotFound } from "../company-not-found";
import { CreateCompanyDialog } from "../create-company-dialog";

const Companies = ({
  companies,
  selectedCompany,
  setSelectedCompany,
  loading,
}: {
  companies: Company[] | null;
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company) => void;
  loading: boolean;
}) => {
  const [createCompanyDialog, setCreateCompanyDialog] =
    useState<boolean>(false);

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight">Şirketlerim</h2>
      <h3 className="text-md mb-4 text-muted-foreground">
        Şirketlerinizi buradan yönetebilirsiniz.
      </h3>
      {companies && selectedCompany ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card
              key={company.id}
              className={`${
                company.id === selectedCompany.id
                  ? "border-2 border-solid border-violet-400"
                  : "hover:cursor-pointer hover:shadow-lg"
              }`}
            >
              <CardHeader
                onClick={() =>
                  company.id !== selectedCompany.id &&
                  setSelectedCompany(company)
                }
              >
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="mr-2 h-6 w-6">
                        <AvatarImage
                          // TODO: Change avatar image url
                          src={`https://avatar.vercel.sh/${company.id}.png`}
                          alt={company.name}
                        />
                        <AvatarFallback>
                          {/* TODO: Get fallback */}
                        </AvatarFallback>
                      </Avatar>
                      <span>{company.name}</span>
                    </div>
                    <span>
                      {company.id === selectedCompany.id && (
                        <Badge variant="outline">Seçili</Badge>
                      )}
                    </span>
                  </div>
                </CardTitle>
                <CardDescription>
                  {plans.find((plan) => plan.id === company.plan)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent
                onClick={() =>
                  company.id !== selectedCompany.id &&
                  setSelectedCompany(company)
                }
              >
                <ul>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      <strong>Adres:</strong> {company.address}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      <strong>Telefon:</strong> {prettifyPhone(company.phone)}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      <strong>Vergi kodu:</strong> {company.taxCode}
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="space-x-2">
                <Button variant="outline">
                  <Pencil className="mr-2 h-4 w-4" />
                  Düzenle
                </Button>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Dialog
            open={createCompanyDialog}
            onOpenChange={setCreateCompanyDialog}
          >
            <Card
              className="duration-150 hover:cursor-pointer hover:shadow-lg"
              onClick={() => setCreateCompanyDialog(true)}
            >
              <CardContent className="flex h-full w-full items-center justify-center p-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <PlusCircle className="mb-2" />
                  <span>Yeni bir şirket oluştur</span>
                </div>
              </CardContent>
            </Card>
            <CreateCompanyDialog setDialog={setCreateCompanyDialog} />
          </Dialog>
        </div>
      ) : (
        <CompanyNotFound loading={loading} />
      )}
    </div>
  );
};

export { Companies };
