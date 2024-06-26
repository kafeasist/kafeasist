"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import type { Plan } from "@kafeasist/api";
import {
  Avatar,
  Badge,
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from "@kafeasist/ui";

import { Logo } from "~/components/logo";
import { getInitials } from "~/utils/get-initials";

type Company = {
  id: number;
  name: string;
  address: string;
  plan: Plan;
  imageUrl: string | null;
};

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  companies: Company[];
  isPending: boolean;
}

export function TopBar({
  className,
  companies,
  isPending,
  ...props
}: TopBarProps) {
  return (
    <section
      className={cn(
        "fixed top-0 z-20 w-full border-b border-border bg-secondary px-6 py-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo height={40} width={40} />
          <span className="invisible text-2xl md:visible">kafeasist</span>
        </div>
        {isPending ? (
          <Skeleton className="h-9 w-[18rem]" />
        ) : (
          <CompanySwitcher companies={companies} />
        )}
      </div>
    </section>
  );
}

function CompanySwitcher({ companies }: { companies: Company[] }) {
  const [open, setOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<
    Company | undefined
  >(companies[0]);
  const { push } = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Bir şirket seçin"
          className="w-[18rem] justify-between truncate"
        >
          {!selectedCompany ? (
            "Şirket bulunamadı"
          ) : (
            <div className="flex items-center space-x-2">
              <Avatar
                alt="Şirket fotoğrafı"
                placeholder={getInitials(selectedCompany.name)}
                className="h-8 w-8"
                src={selectedCompany.imageUrl || ""}
                size={24}
              />
              <span className="truncate">{selectedCompany.name}</span>
              <Badge variant="outline">{selectedCompany.plan}</Badge>
            </div>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[18rem] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Şirketlerimi ara..." />
            <CommandEmpty>
              <p className="text-muted-foreground">Şirket bulunamadı</p>
            </CommandEmpty>
            {companies.map((company) => (
              <CommandItem
                key={company.id}
                onSelect={() => {
                  setSelectedCompany(company);
                  setOpen(false);
                }}
                className="py-2 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <Avatar
                    alt="Şirket fotoğrafı"
                    placeholder={getInitials(company.name)}
                    className="h-8 w-8"
                    src={company.imageUrl || ""}
                    size={24}
                  />
                  <span className="truncate">{company.name}</span>
                  <Badge variant="outline">{company.plan}</Badge>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedCompany?.name === company.name
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup className="p-0">
              <CommandItem
                className="py-2 text-sm"
                onSelect={() => {
                  setOpen(false);
                  push("/panel/sirketlerim/olustur");
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni bir şirket oluştur
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
