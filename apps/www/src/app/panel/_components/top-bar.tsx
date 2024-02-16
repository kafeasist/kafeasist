"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

import {
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
} from "@kafeasist/ui";

import { Logo } from "~/components/logo";

interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TopBar({ className, ...props }: TopBarProps) {
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
          <Logo width={39} />
          <span className="invisible text-2xl md:visible">kafeasist</span>
        </div>
        <CompanySwitcher companies={["testing", "testing2"]} />
      </div>
    </section>
  );
}

function CompanySwitcher({ companies }: { companies: string[] }) {
  const [open, setOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<string>(
    companies[0]!,
  );
  const { push } = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className="w-[18rem] justify-between truncate"
        >
          {selectedCompany}
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
                key={company}
                onSelect={() => {
                  setSelectedCompany(company);
                  setOpen(false);
                }}
                className="py-2 text-sm"
              >
                {company}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedCompany === company ? "opacity-100" : "opacity-0",
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
