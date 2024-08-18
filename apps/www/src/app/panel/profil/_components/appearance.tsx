"use client";

import { Check, ChevronDown, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@kafeasist/ui";

export function Appearance() {
  const { setTheme, theme } = useTheme();

  return (
    <Card id="gorunum">
      <div className="space-y-1 p-6">
        <h2 className="font-bold">Görünüm ayarları</h2>
        <p className="text-sm text-muted-foreground">
          Uygulamanın görünüm ayarlarını buradan değiştirebilirsiniz.
        </p>
      </div>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full items-center justify-between space-y-4 rounded-xl border border-border p-6 md:flex md:space-y-0">
            <div>
              <h3 className="text-sm font-bold">Tema</h3>
              <p className="text-sm text-muted-foreground">
                Uygulamanın temasını kendi zevkinize göre ayarlayabilirsiniz.
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  {theme === "dark" ? (
                    <>
                      <Moon className="mr-2 size-4" /> Karanlık
                    </>
                  ) : theme === "light" ? (
                    <>
                      <Sun className="mr-2 size-4" /> Aydınlık
                    </>
                  ) : (
                    <>
                      <Laptop className="mr-2 size-4" /> Sistem
                    </>
                  )}
                  <ChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  {theme === "light" && <Check className="mr-2 size-4" />}{" "}
                  Aydınlık
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  {theme === "dark" && <Check className="mr-2 size-4" />}{" "}
                  Karanlık
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  {theme === "system" && <Check className="mr-2 size-4" />}{" "}
                  Sistem
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
