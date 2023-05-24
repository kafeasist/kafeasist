"use client";

import { Badge } from "../ui/badge";
import { CreateCompanyDialog } from "./createCompanyDialog";
import { Company } from "@prisma/client";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useCompany } from "~/hooks/useCompany";
import { cn } from "~/lib/utils";
import { prettifyString } from "~/utils/prettify";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  selectedCompany: Company | null;
  companies: Company[] | null;
}

// TODO: Add default team
export default function TeamSwitcher({
  className,
  selectedCompany,
  companies,
}: TeamSwitcherProps) {
  const { setSelectedCompany } = useCompany();
  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Company | null>(
    selectedCompany,
  );

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Bir şirket seçin"
            className={cn("w-[140px] justify-between md:w-[200px]", className)}
          >
            {selectedTeam && (
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage
                  // TODO: Change avatar image url
                  src={`https://avatar.vercel.sh/${selectedTeam.id}.png`}
                  alt={selectedTeam.name}
                />
                <AvatarFallback>{/* TODO: Get fallback */}</AvatarFallback>
              </Avatar>
            )}
            {selectedTeam ? (
              <div className="flex w-full items-center justify-between space-x-1">
                <span>{prettifyString(selectedTeam.name, 10)}</span>
                <Badge variant="outline" className="hidden md:flex">
                  {selectedTeam.plan}
                </Badge>
              </div>
            ) : (
              "Şirket bulunamadı"
            )}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Şirket ara..." />
              <CommandEmpty>Şirket bulunamadı.</CommandEmpty>
              <CommandGroup heading="Şirketlerim">
                {companies &&
                  companies.map((company) => (
                    <CommandItem
                      key={company.id}
                      onSelect={() => {
                        setSelectedTeam(company);
                        setSelectedCompany(company);
                        setOpen(false);
                      }}
                      className="text-sm hover:cursor-pointer"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          // TODO: Change avatar image url
                          src={`https://avatar.vercel.sh/${company.id}.png`}
                          alt={company.name}
                        />
                        <AvatarFallback>
                          {/* TODO: Get fallback */}
                        </AvatarFallback>
                      </Avatar>
                      {company.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam?.id === company.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                    className="hover:cursor-pointer"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Bir şirket oluştur
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateCompanyDialog setDialog={setShowNewTeamDialog} />
    </Dialog>
  );
}
